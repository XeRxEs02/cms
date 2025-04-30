import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const AddLabourBillModal = ({ setShowModal }) => {
  const initialValues = {
    date: "",
    barbender: "",
    headmanson: "",
    manson: "",
    mhelper: "",
    whelper: "",
    total: "",
    extrapayment: "",
    remarks: "",
  };

  const validationSchema = Yup.object().shape({
    date: Yup.date().required("Date is required"),
    barbender: Yup.string().required("Bar Bender is required"),
    headmanson: Yup.number()
      .typeError("Must be a number")
      .required("Head Manson is required"),
    manson: Yup.number()
      .typeError("Must be a number")
      .required("Manson is required"),
    mhelper: Yup.number()
      .typeError("Must be a number")
      .required("M-Helper is required"),
    whelper: Yup.number()
      .typeError("Must be a number")
      .required("W-Helper is required"),
    total: Yup.number()
      .typeError("Must be a number")
      .required("Total is required"),
    extrapayment: Yup.number()
      .typeError("Must be a number")
      .required("Extra Payment is required"),
    remarks: Yup.string(),
  });

  const handleSubmit = (values) => {
    console.log("Form data", values);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center min-h-screen z-50">
      <div className="bg-white rounded-md w-full max-w-md p-6 mx-4 sm:mx-6 lg:mx-8 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <h2 className="font-semibold text-xl text-black mb-2">
          Add Labour Bill
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Fill in the details to add a new labour bill.
        </p>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Bar Bender
                </label>
                <Field
                  as="select"
                  name="barbender"
                  className="w-full border border-gray-600 rounded-md p-2 mt-1"
                >
                  <option value="">Select</option>
                  <option value="Column BarBending">Column BarBending</option>
                  <option value="Beam BarBending">Beam BarBending</option>
                  <option value="Slab BarBending">Slab BarBending</option>
                </Field>
                <ErrorMessage
                  name="barbender"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Head Manson
                  </label>
                  <Field
                    name="headmanson"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="headmanson"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Manson
                  </label>
                  <Field
                    name="manson"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="manson"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    M-Helper
                  </label>
                  <Field
                    name="mhelper"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="mhelper"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    W-Helper
                  </label>
                  <Field
                    name="whelper"
                    type="number"
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                  <ErrorMessage
                    name="whelper"
                    component="div"
                    className="text-red-600 text-xs mt-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Total
                </label>
                <Field
                  name="total"
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <ErrorMessage
                  name="total"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Extra Payment
                </label>
                <Field
                  name="extrapayment"
                  type="number"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <ErrorMessage
                  name="extrapayment"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Date
                </label>
                <Field
                  name="date"
                  type="date"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <ErrorMessage
                  name="date"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Remarks
                </label>
                <Field
                  name="remarks"
                  type="text"
                  as="textarea"
                  rows="2"
                  className="w-full border border-gray-300 rounded-md p-2"
                />
                <ErrorMessage
                  name="remarks"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold"
                >
                  Add Bill
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddLabourBillModal;
