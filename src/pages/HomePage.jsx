// src/pages/HomePage.jsx
import InvoiceForm from '../components/InvoiceForm';

const HomePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-8">Create Invoice</h1>
      <InvoiceForm />
    </div>
  );
};

export default HomePage;