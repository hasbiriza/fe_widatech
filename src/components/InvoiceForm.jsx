import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const BASE_URL = "http://localhost:8000";

const InvoiceForm = () => {
  const [values, setValues] = useState({
    date: "",
    customer_name: "",
    salesperson_name: "",
    notes: "",
    items: [],
  });

  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productSuggestions, setProductSuggestions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/products`);
        const productsWithFullImageUrl = response.data.map((product) => ({
          ...product,
          image: `${BASE_URL}${product.image}`,
        }));
        setProducts(productsWithFullImageUrl);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};
    if (!values.date) errors.date = "Date is required";
    if (!values.customer_name)
      errors.customer_name = "Customer name is required";
    if (!values.salesperson_name)
      errors.salesperson_name = "Salesperson name is required";
    if (!values.notes) errors.notes = "Notes are required";
    if (values.items.length === 0)
      errors.items = "At least one item is required";
    setErrors(errors);
    return Object.keys(errors).length === 0;
  }, [values, setErrors]);

  useEffect(() => {
    validateForm();
  }, [values, validateForm]);

  const handleProductSearch = (e) => {
    const searchQuery = e.target.value;
    setProductSearch(searchQuery);
    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setProductSuggestions(filteredProducts);
  };

  const handleProductSelect = (product) => {
    const newItems = [
      ...values.items,
      { product_id: product.id, quantity: 1, price: product.price },
    ];
    setValues({ ...values, items: newItems });
    setProductSearch("");
    setProductSuggestions([]);
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...values.items];
    newItems[index].quantity = quantity;
    setValues({ ...values, items: newItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
    try {
      const totalAmount = values.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await axios.post(`${BASE_URL}/api/invoices`, {
        ...values,
        total_amount: totalAmount,
        items: values.items.map((item) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      Swal.fire("Success!", "Invoice created successfully!", "success");
      setValues({
        date: "",
        customer_name: "",
        salesperson_name: "",
        notes: "",
        items: [],
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
      Swal.fire(
        "Error!",
        "Failed to create invoice. Please try again later.",
        "error"
      );
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="date"
          >
            Date:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => setValues({ ...values, date: e.target.value })}
          />
          {errors.date && (
            <div className="text-red-500 text-sm">{errors.date}</div>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="customer_name"
          >
            Customer Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="customer_name"
            type="text"
            value={values.customer_name}
            onChange={(e) =>
              setValues({ ...values, customer_name: e.target.value })
            }
          />
          {errors.customer_name && (
            <div className="text-red-500 text-sm">{errors.customer_name}</div>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="salesperson_name"
          >
            Salesperson Name:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="salesperson_name"
            type="text"
            value={values.salesperson_name}
            onChange={(e) =>
              setValues({ ...values, salesperson_name: e.target.value })
            }
          />
          {errors.salesperson_name && (
            <div className="text-red-500 text-sm">
              {errors.salesperson_name}
            </div>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="notes"
          >
            Notes:
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="notes"
            value={values.notes}
            onChange={(e) => setValues({ ...values, notes: e.target.value })}
          />
          {errors.notes && (
            <div className="text-red-500 text-sm">{errors.notes}</div>
          )}
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="product_search"
          >
            Product Items:
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="product_search"
            type="text"
            value={productSearch}
            onChange={handleProductSearch}
            placeholder="Search for products"
          />
          <ul className="mt-4 space-y-4">
            {productSuggestions.map((product) => (
              <li
                key={product.id}
                className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover"
                />
                <div className="flex-grow p-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      Stock: {product.stock}
                    </span>
                    <span className="ml-4 font-medium text-gray-800">
                      Price: Rp {product.price.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleProductSelect(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 m-4 rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
          {errors.items && (
            <div className="text-red-500 text-sm">{errors.items}</div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Selected Items
          </h3>
          {values.items.map((item, index) => {
            const product = products.find((p) => p.id === item.product_id);
            return (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center justify-between bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center w-full sm:w-1/2 mb-4 sm:mb-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <span className="font-semibold text-gray-800">
                      {product.name}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">
                      Price: Rp {item.price.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-1/2">
                  <div className="flex items-center">
                    <label className="mr-2 text-gray-700 whitespace-nowrap">
                      Quantity:
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(index, parseInt(e.target.value))
                      }
                      className="shadow-sm border border-gray-300 rounded-md w-20 py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>
                  <span className="font-medium text-gray-800 whitespace-nowrap">
                    Total: Rp{" "}
                    {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">
                Total Amount:
              </span>
              <span className="text-xl font-bold text-blue-600">
                Rp{" "}
                {values.items
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                  )
                  .toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Invoice
          </button>
        </div>
      </form>
      <div className="mt-8 text-center">
        <Link
          to="/invoice"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0"
        >
          Lihat Invoice
        </Link>
      </div>
    </>
  );
};

export default InvoiceForm;
