import axios from 'axios';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

const App = () => {

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);



  const initialValues = {
    date: '',
    customer_name: '',
    salesperson_name: '',
    notes: '',
  };

  const validationSchema = Yup.object({
    date: Yup.string().required('Date is required'),
    customer_name: Yup.string().required('Customer name is required'),
    salesperson_name: Yup.string().required('Salesperson name is required'),
    notes: Yup.string().required('Notes is required').min(10, 'Notes must be at least 10 characters'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      await axios.post('http://localhost:8000/api/invoices', values);
      Swal.fire('Success!', 'Invoice created successfully!', 'success');
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
      Swal.fire('Error!', 'Failed to create invoice. Please try again later.', 'error');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Add Invoice</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="date">
                Date:
              </label>
              <Field
                className="border border-gray-400 p-2 rounded-md w-full"
                type="date"
                name="date"
                id="date"
              />
              <ErrorMessage
                name="date"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="customer_name">
                Customer Name:
              </label>
              <Field
                className="border border-gray-400 p-2 rounded-md w-full"
                type="text"
                name="customer_name"
                id="customer_name"
              />
              <ErrorMessage
                name="customer_name"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-4">
              <label className="block font-bold mb-2" htmlFor="salesperson_name">
                Salesperson Name:
              </label>
              <Field
                className="border border-gray-400 p-2 rounded-md w-full"
                type="text"
                name="salesperson_name"
                id="salesperson_name"
              />
              <ErrorMessage
                name="salesperson_name"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <label className="block font-bold mb-2" htmlFor="notes">
                Notes:
              </label>
              <Field
                className="border border-gray-400 p-2 rounded-md w-full"
                as="textarea"
                name="notes"
                id="notes"
              />
              <ErrorMessage
                name="notes"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
            >
              Submit Invoice
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default App;