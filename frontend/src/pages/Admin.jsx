import { useState } from 'react';
import ProductManager from '../components/admin/ProductManager';
import CategoryManager from '../components/admin/CategoryManager';
import OrderManager from '../components/admin/OrderManager';
import AdminLayout from '../components/admin/AdminLayout';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('products');
  const tabs = [['products', 'Products'], ['categories', 'Categories'], ['orders', 'Orders']];
  return <><Navbar /><AdminLayout><div className="max-w-6xl mx-auto mt-12 p-6 bg-white rounded shadow"><h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1><div className="flex justify-center flex-wrap gap-4 mb-8">{tabs.map(([key, label]) => <button key={key} onClick={() => setActiveTab(key)} className={`px-6 py-2 rounded font-semibold ${activeTab === key ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{label}</button>)}</div>{activeTab === 'products' && <ProductManager />}{activeTab === 'categories' && <CategoryManager />}{activeTab === 'orders' && <OrderManager />}</div></AdminLayout><Footer /></>;
}
