import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = "http://localhost:8000";

const InvoicePage = () => {
  const [invoiceIds, setInvoiceIds] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchInvoiceIds = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/invoices`);
      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setInvoiceIds(response.data.map(invoice => invoice.id));
      }
    } catch (err) {
      setError('Failed to fetch invoice IDs');
    }
  }, []);

  const fetchInvoiceById = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/invoices/${id}`);
      setInvoices(prevInvoices => [...prevInvoices, response.data]);
    } catch (err) {
      setError('Failed to fetch invoice');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoiceIds();
  }, [fetchInvoiceIds]);

  useEffect(() => {
    if (invoiceIds.length > 0 && currentIndex < invoiceIds.length) {
      fetchInvoiceById(invoiceIds[currentIndex]);
    }
  }, [currentIndex, invoiceIds, fetchInvoiceById]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore && currentIndex < invoiceIds.length - 1) {
      setCurrentIndex(prevIndex => prevIndex + 1);
    } else {
      setHasMore(false);
    }
  }, [loading, hasMore, currentIndex, invoiceIds.length]);

  return (
    <div className="max-w-7xl mx-auto mt-8 p-6 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 border-b pb-4">Invoice Dashboard</h1>
      
      {error && <p className="text-red-500 mb-4 bg-red-100 p-3 rounded-lg">{error}</p>}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map(invoice => (
          <div key={invoice.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-200">
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-3 text-gray-800">Invoice #{invoice.id}</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium text-gray-700">Customer:</span> {invoice.customer_name}</p>
                <p><span className="font-medium text-gray-700">Salesperson:</span> {invoice.salesperson_name}</p>
                <p><span className="font-medium text-gray-700">Date:</span> {new Date(invoice.date).toLocaleDateString()}</p>
                <p><span className="font-medium text-gray-700">Total Amount:</span> Rp {invoice.total_amount.toLocaleString('id-ID')}</p>
              </div>
              <p className="mt-4 text-sm text-gray-500"><span className="font-medium text-gray-700">Notes:</span> {invoice.notes}</p>
              <Link 
                to={`/invoice/${invoice.id}`} 
                className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 text-sm font-semibold"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      <div className="mt-8 flex justify-center">
        {hasMore && !loading && (
          <button 
            onClick={handleLoadMore} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            Load More
          </button>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link
          to="/"
          className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Back to Create Invoice
        </Link>
      </div>
     
    </div>
  );
};

export default InvoicePage;