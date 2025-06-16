import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import { useLocation } from "react-router-dom";
import { DraftingCompass, Search, Upload, X, Eye, FileText, Image, Check, X as XMark } from "lucide-react";
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { useToast } from '../context/ToastContext';

// Initial drawings data
const initialDrawings = [
  { id: 1, no: "01", name: "Basic Plan", status: "Approved", file: null },
  { id: 2, no: "02", name: "Plinth Beam Plan", status: "Approved", file: null },
  { id: 3, no: "03", name: "Site Diagram", status: "Rejected", file: null },
  { id: 4, no: "04", name: "Blue Print", status: "Submitted", file: null },
];
const statusClasses = {
  Approved: "text-green-600 border border-green-500 px-2 py-0.5 rounded-full text-xs",
  Rejected: "text-red-600 border border-red-500 px-2 py-0.5 rounded-full text-xs",
  Submitted: "text-blue-600 border border-blue-500 px-2 py-0.5 rounded-full text-xs",
  Resubmitted: "text-blue-600 border border-blue-500 px-2 py-0.5 rounded-full text-xs",
  Reupload: "bg-red-500 text-white px-2 py-0.5 rounded-full text-xs cursor-pointer hover:bg-red-600",
};

function FilterIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
      />
    </svg>
  );
}

function CustomButton({ children, className, variant = "solid", ...props }) {
  const base =
    variant === "outline"
      ? "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
      : "bg-red-600  text-white";

  return (
    <button
      className={`px-4 py-2 rounded-md text-md transition ${base} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

function CustomInput({ className, ...props }) {
  return (
    <div className="relative">
      <input
        type="text"
        className="border rounded-md pl-10 py-2"
        placeholder="Search"
      // value={searchTerm}
      // onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Search className=" absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
  );
}

// Upload Drawing Modal Component
const UploadDrawingModal = ({ isOpen, onClose, onUpload, selectedDrawing, onResubmit }) => {
  const [drawingName, setDrawingName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedDrawing) {
      setDrawingName(selectedDrawing.name);
    }
  }, [selectedDrawing]);

  // Allowed file types
  const allowedTypes = [
    "application/pdf", // PDF
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/webp", "image/tiff" // Images
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        setError("");
      } else {
        setSelectedFile(null);
        setError("Please select a PDF or image file");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!drawingName.trim()) {
      setError("Please enter a drawing name");
      return;
    }

    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    if (selectedDrawing) {
      // This is a resubmission
      onResubmit({
        ...selectedDrawing,
        file: selectedFile
      });
    } else {
      // This is a new submission
      onUpload({
        name: drawingName,
        file: selectedFile
      });
    }

    // Reset form
    setDrawingName("");
    setSelectedFile(null);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {selectedDrawing ? "Resubmit Drawing" : "Upload Drawing"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Drawing Name
            </label>
            <input
              type="text"
              value={drawingName}
              onChange={(e) => setDrawingName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter drawing name"
              disabled={selectedDrawing}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload File (PDF or Image)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.tiff"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center justify-center"
              >
                <Upload className="text-gray-400 mb-2" size={24} />
                <span className="text-sm text-gray-500">
                  {selectedFile ? selectedFile.name : "Click to upload PDF or image"}
                </span>
              </label>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              {selectedDrawing ? "Resubmit" : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Drawing Modal Component
const ViewDrawingModal = ({ isOpen, onClose, drawing, onStatusChange }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();

  if (!isOpen || !drawing) return null;

  const isPDF = drawing.file.type === "application/pdf";
  const isImage = drawing.file.type.startsWith("image/");

  const addWatermarkToImage = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const watermarkText = 'APPROVED';
        
        // Calculate maximum possible font size to ensure text fits
        const diagonal = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
        let fontSize = diagonal * 0.25; // Keep the larger font size
        
        // Measure text width with current font size
        ctx.font = `bold ${fontSize}px Arial`;
        const metrics = ctx.measureText(watermarkText);
        const textWidth = metrics.width;
        const textHeight = fontSize * 1.2;
        
        // Calculate rotated text dimensions with padding
        const padding = 30;
        const rotatedWidth = Math.abs(textWidth * Math.cos(Math.PI/4)) + Math.abs(textHeight * Math.sin(Math.PI/4)) + padding;
        const rotatedHeight = Math.abs(textWidth * Math.sin(Math.PI/4)) + Math.abs(textHeight * Math.cos(Math.PI/4)) + padding;
        
        // Adjust font size if text is too large
        while ((rotatedWidth > canvas.width * 0.75 || rotatedHeight > canvas.height * 0.75) && fontSize > 12) {
          fontSize *= 0.95;
          ctx.font = `bold ${fontSize}px Arial`;
          const newMetrics = ctx.measureText(watermarkText);
          const newTextWidth = newMetrics.width;
          const newTextHeight = fontSize * 1.2;
          const newRotatedWidth = Math.abs(newTextWidth * Math.cos(Math.PI/4)) + Math.abs(newTextHeight * Math.sin(Math.PI/4)) + padding;
          const newRotatedHeight = Math.abs(newTextWidth * Math.sin(Math.PI/4)) + Math.abs(newTextHeight * Math.cos(Math.PI/4)) + padding;
          if (newRotatedWidth <= canvas.width * 0.75 && newRotatedHeight <= canvas.height * 0.75) {
            break;
          }
        }
        
        // Verify final text dimensions
        const finalMetrics = ctx.measureText(watermarkText);
        const finalWidth = finalMetrics.width;
        const finalHeight = fontSize * 1.2;
        const finalRotatedWidth = Math.abs(finalWidth * Math.cos(Math.PI/4)) + Math.abs(finalHeight * Math.sin(Math.PI/4)) + padding;
        const finalRotatedHeight = Math.abs(finalWidth * Math.sin(Math.PI/4)) + Math.abs(finalHeight * Math.cos(Math.PI/4)) + padding;
        
        // Only proceed if text fits within limits
        if (finalRotatedWidth > canvas.width * 0.75 || finalRotatedHeight > canvas.height * 0.75) {
          reject(new Error('Page too small to fit watermark properly'));
          return;
        }
        
        ctx.fillStyle = 'rgba(128, 128, 128, 0.35)';
        ctx.save();
        // Position text in top left corner with padding
        const leftPadding = padding;
        const topPadding = padding;
        ctx.translate(leftPadding, topPadding);
        ctx.rotate(-Math.PI / 4);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(watermarkText, 0, 0);
        ctx.restore();
        canvas.toBlob((blob) => {
          const watermarkedFile = new File([blob], file.name, { type: file.type });
          resolve(watermarkedFile);
        }, file.type);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      let watermarkedFile;

      if (isPDF) {
        console.log('Processing PDF...');
        const fileReader = new FileReader();
        
        const pdfBytes = await new Promise((resolve, reject) => {
          fileReader.onload = () => resolve(fileReader.result);
          fileReader.onerror = reject;
          fileReader.readAsArrayBuffer(drawing.file);
        });
        
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const { width, height } = page.getSize();
          const diagonal = Math.sqrt(width * width + height * height);
          const watermarkText = 'APPROVED';
          
          // Calculate initial font size
          let fontSize = diagonal * 0.25;
          
          // Calculate text dimensions with padding
          const padding = 30;
          const textWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
          const textHeight = fontSize * 1.2;
          
          // Calculate rotated text dimensions
          const rotatedWidth = Math.abs(textWidth * Math.cos(Math.PI/4)) + Math.abs(textHeight * Math.sin(Math.PI/4)) + padding;
          const rotatedHeight = Math.abs(textWidth * Math.sin(Math.PI/4)) + Math.abs(textHeight * Math.cos(Math.PI/4)) + padding;
          
          // Adjust font size if text is too large
          while ((rotatedWidth > width * 0.75 || rotatedHeight > height * 0.75) && fontSize > 12) {
            fontSize *= 0.95;
            const newTextWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
            const newTextHeight = fontSize * 1.2;
            const newRotatedWidth = Math.abs(newTextWidth * Math.cos(Math.PI/4)) + Math.abs(newTextHeight * Math.sin(Math.PI/4)) + padding;
            const newRotatedHeight = Math.abs(newTextWidth * Math.sin(Math.PI/4)) + Math.abs(newTextHeight * Math.cos(Math.PI/4)) + padding;
            if (newRotatedWidth <= width * 0.75 && newRotatedHeight <= height * 0.75) {
              break;
            }
          }
          
          // Verify final text dimensions
          const finalTextWidth = helveticaFont.widthOfTextAtSize(watermarkText, fontSize);
          const finalTextHeight = fontSize * 1.2;
          const finalRotatedWidth = Math.abs(finalTextWidth * Math.cos(Math.PI/4)) + Math.abs(finalTextHeight * Math.sin(Math.PI/4)) + padding;
          const finalRotatedHeight = Math.abs(finalTextWidth * Math.sin(Math.PI/4)) + Math.abs(finalTextHeight * Math.cos(Math.PI/4)) + padding;
          
          // Only proceed if text fits within limits
          if (finalRotatedWidth > width * 0.75 || finalRotatedHeight > height * 0.75) {
            throw new Error('Page too small to fit watermark properly');
          }
          
          // Calculate position - top left corner with padding
          const leftPadding = padding;
          const topPadding = padding;
          
          // Draw watermark starting from top left
          page.drawText(watermarkText, {
            x: leftPadding,
            y: height - topPadding, // PDF coordinates start from bottom-left
            size: fontSize,
            font: helveticaFont,
            color: rgb(0.5, 0.5, 0.5),
            opacity: 0.35,
            rotate: degrees(-45),
            textAlign: 'left',
            textBaseline: 'top'
          });
        }

        const modifiedPdfBytes = await pdfDoc.save();
        watermarkedFile = new File([modifiedPdfBytes], drawing.file.name, { type: 'application/pdf' });
      } else if (isImage) {
        console.log('Processing image...');
        watermarkedFile = await addWatermarkToImage(drawing.file);
      } else {
        throw new Error('Unsupported file type');
      }
      
      onStatusChange(drawing.id, "Approved", watermarkedFile);
      showToast(`Drawing "${drawing.name}" has been approved`, 'success');
      onClose();
    } catch (error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        errorObject: error
      });
      showToast(error.message === 'Page too small to fit watermark properly' 
        ? 'Page size too small to add watermark properly' 
        : 'Failed to approve drawing', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = () => {
    onStatusChange(drawing.id, "Rejected");
    showToast(`Drawing "${drawing.name}" rejected`, 'error');
    onClose();
  };

  const showActionButtons = () => {
    // Show buttons only if:
    // 1. Status is "Submitted" (first submission)
    // 2. Status is "Resubmitted" (after rejection)
    return drawing.status === "Submitted" || drawing.status === "Resubmitted";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{drawing.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {isPDF ? (
            <iframe
              src={URL.createObjectURL(drawing.file)}
              className="w-full h-[70vh]"
              title={drawing.name}
            />
          ) : (
            <img
              src={URL.createObjectURL(drawing.file)}
              alt={drawing.name}
              className="max-w-full max-h-[70vh] mx-auto"
            />
          )}
        </div>

        <div className="mt-4 flex justify-end space-x-3">
          {showActionButtons() && (
            <>
              <button
                onClick={handleReject}
                disabled={isProcessing}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <XMark size={16} className="mr-1" />
                Reject
              </button>
              <button
                onClick={handleApprove}
                disabled={isProcessing}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={16} className="mr-1" />
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Billing = () => {
  const location = useLocation();
  const [drawings, setDrawings] = useState(initialDrawings);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDrawing, setSelectedDrawing] = useState(null);

  // Function to handle drawing upload
  const handleDrawingUpload = (drawingData) => {
    const newDrawing = {
      id: drawings.length + 1,
      no: String(drawings.length + 1).padStart(2, '0'),
      name: drawingData.name,
      status: "Submitted",
      file: drawingData.file
    };

    setDrawings([...drawings, newDrawing]);
  };

  // Function to handle status change
  const handleStatusChange = (drawingId, newStatus, newFile = null) => {
    setDrawings(drawings.map(drawing => {
      if (drawing.id === drawingId) {
        return {
          ...drawing,
          status: newStatus,
          file: newFile || drawing.file
        };
      }
      return drawing;
    }));
  };

  // Function to handle resubmission
  const handleResubmission = (drawing) => {
    setDrawings(drawings.map(d => {
      if (d.id === drawing.id) {
        return {
          ...d,
          status: "Resubmitted",
          file: drawing.file
        };
      }
      return d;
    }));
  };

  // Function to handle drawing view
  const handleViewDrawing = (drawing) => {
    if (drawing.file) {
      setSelectedDrawing(drawing);
      setIsViewModalOpen(true);
    } else {
      // If no file, prompt to upload one
      const shouldUpload = window.confirm("No file available for this drawing. Would you like to upload one?");
      if (shouldUpload) {
        setSelectedDrawing(drawing);
        setIsUploadModalOpen(true);
      }
    }
  };

  return (
    <>
      <Navbar currentPath={location.pathname} icon={DraftingCompass} />
      <div className="px-6 py-4  mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
          <div className="flex gap-2 items-center">
            <CustomButton variant="outline" className="flex items-center gap-2">
              <FilterIcon className="w-6 h-6" />
              Filter
            </CustomButton>
            <CustomInput
              type="text"
              placeholder="Search"
              className="max-w-xs"
            />
          </div>
          <CustomButton
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setIsUploadModalOpen(true)}
          >
            Upload Drawing
          </CustomButton>
        </div>

        <table className="w-full table-auto text-left bg-white shadow-sm rounded-lg overflow-hidden">
          <thead className="bg-gray-200 border-b border-gray-200">
            <tr>
              <th className="p-3 text-sm font-semibold">NO.</th>
              <th className="p-3 text-sm font-semibold">Particulars</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">File Type</th>
              <th className="p-3 text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {drawings.map((drawing) => (
              <tr
                key={drawing.id}
                className="border-t hover:bg-gray-50 text-sm"
              >
                <td className="p-3 font-medium">{drawing.no}</td>
                <td className="p-3 text-red-600 font-medium">{drawing.name}</td>
                <td className="p-3 space-x-2">
                  {drawing.status === "Rejected" ? (
                    <>
                      <span className={statusClasses[drawing.status]}>
                        {drawing.status}
                      </span>
                      <span
                        className={statusClasses["Reupload"]}
                        onClick={() => {
                          setSelectedDrawing(drawing);
                          setIsUploadModalOpen(true);
                        }}
                      >
                        Re-Upload
                      </span>
                    </>
                  ) : (
                    <span className={statusClasses[drawing.status]}>
                      {drawing.status}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  {drawing.file ? (
                    <div className="flex items-center">
                      {drawing.file.type === "application/pdf" ? (
                        <FileText size={16} className="text-red-500 mr-1" />
                      ) : (
                        <Image size={16} className="text-blue-500 mr-1" />
                      )}
                      <span className="text-xs">
                        {drawing.file.type === "application/pdf" ? "PDF" : "Image"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">No file</span>
                  )}
                </td>
                <td className="p-3">
                  <CustomButton
                    variant="outline"
                    className="text-xs flex items-center gap-1"
                    onClick={() => handleViewDrawing(drawing)}
                  >
                    <Eye size={14} />
                    View
                  </CustomButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Drawing Modal */}
      <UploadDrawingModal
        isOpen={isUploadModalOpen}
        onClose={() => {
          setIsUploadModalOpen(false);
          setSelectedDrawing(null);
        }}
        onUpload={handleDrawingUpload}
        selectedDrawing={selectedDrawing}
        onResubmit={handleResubmission}
      />

      {/* View Drawing Modal */}
      <ViewDrawingModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedDrawing(null);
        }}
        drawing={selectedDrawing}
        onStatusChange={handleStatusChange}
      />
    </>
  );
};

export default Billing;
