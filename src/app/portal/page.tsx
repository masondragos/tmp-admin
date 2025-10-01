"use client";

export default function PortalPage() {
  // Mock data for demonstration
  const stats = {
    totalLenders: 47,
    totalProducts: 156,
    totalApplications: 89,
    totalMatches: 234
  };

  return <div>

<nav className="bg-gradient-to-r from-gray-50 to-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-center h-20">
                <div className="flex items-center">
                    <div className="flex items-center">
                        <button className="flex items-center hover:opacity-80 transition-opacity duration-200 cursor-pointer group">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:shadow-lg transition-shadow duration-200">
                                <span className="text-white text-lg font-bold">R</span>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Rogue Funding Admin</h1>
                        </button>
                    </div>
                    <span className="ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 border border-green-200">
                        ✅ Backend Dashboard
                </span>
                </div>
                
                <div className="flex space-x-3">
                    <button className="nav-button bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-blue-500">
                        🏠 Dashboard
                    </button>
                    <button className="nav-button bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-purple-500">
                        📋 Lenders
                    </button>
                    <button className="nav-button bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-orange-500">
                        🛒 Products
                    </button>
                    <button className="nav-button bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-green-500">
                        📝 Applications
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <div className="container mx-auto px-6 py-8 pb-24">
        <div id="dashboardContent" className="page-content active">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <button className="stats-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl hover:shadow-blue-100 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer group border border-gray-100 hover:border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Total Lenders</h3>
                        <svg className="w-5 h-5 text-blue-500 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-blue-600 group-hover:text-blue-700 transition-colors" id="totalLenders">{stats.totalLenders}</p>
                    <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">Active lending partners</p>
                    <div className="mt-3 text-xs text-blue-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view all lenders →
                    </div>
                </button>
                <button className="stats-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl hover:shadow-green-100 transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer group border border-gray-100 hover:border-green-200">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Loan Products</h3>
                        <svg className="w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </div>
                    <p className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors" id="totalProducts">{stats.totalProducts}</p>
                    <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">Available loan types</p>
                    <div className="mt-3 text-xs text-green-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view all products →
            </div>
                </button>
                <button className="stats-card bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 cursor-pointer group border border-gray-100 hover:border-green-200">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 transition-colors">Applications</h3>
                        <svg className="w-5 h-5 text-green-500 group-hover:text-green-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
            </div>
                    <p className="text-3xl font-bold text-green-600 group-hover:text-green-700 transition-colors" id="totalApplications">{stats.totalApplications}</p>
                    <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600 transition-colors">Submitted requests</p>
                    <div className="mt-3 text-xs text-green-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view all applications →
            </div>
                </button>
                <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Matches Made</h3>
                <p className="text-3xl font-bold text-orange-600" id="totalMatches">{stats.totalMatches}</p>
                    <p className="text-sm text-gray-500 mt-1">Successful matches</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8 border border-gray-100">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">API Endpoints</h2>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Health Check
                                </h3>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-2">GET /health</code>
                                <p className="text-xs text-gray-600">Server status and environment info</p>
                            </div>
                            
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Database Stats
                                </h3>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-2">GET /api/stats</code>
                                <p className="text-xs text-gray-600">Overview of all database metrics</p>
                            </div>
                            
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                    Lenders
                                </h3>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-2">GET /api/lenders</code>
                                <p className="text-xs text-gray-600">All active lending partners</p>
                            </div>
                            
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    Loan Products
                                </h3>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-2">GET /api/products</code>
                                <p className="text-xs text-gray-600">Available loan products and terms</p>
                            </div>
                            
                            <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    Submit Application
                                </h3>
                                <code className="text-sm bg-gray-100 px-2 py-1 rounded block mb-2">POST /api/submit-application</code>
                                <p className="text-xs text-gray-600">Process loan applications</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">ResFunding Admin</h2>
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                    🔗 Port 5001
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                    🚀 API Ready
                                </span>
            </div>
        </div>

                        <div id="dataDisplay" className="bg-gray-50 rounded-lg p-6 min-h-96">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Backend Dashboard</h3>
                                <p className="text-gray-600 mb-4">Click any button in the navigation bar to load data and test API endpoints.</p>
                                <div className="flex justify-center space-x-4">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm">
                    🔄 Refresh Stats
                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="lendersContent" className="page-content">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Lenders Database</h2>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            📋 All 50 States
                        </span>
                    </div>
                </div>
                
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" id="lenderSearch" placeholder="Search lenders..." className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">All Loan Types</option>
                        <option value="fix-and-flip">Fix & Flip</option>
                        <option value="dscr">DSCR</option>
                        <option value="new-construction">New Construction</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                        <option value="">All Credit Scores</option>
                        <option value="excellent">Excellent (750+)</option>
                        <option value="good">Good (700-749)</option>
                        <option value="fair">Fair (650-699)</option>
                        <option value="poor">Poor (&gt;650)</option>
                    </select>
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                        🔍 Filter
                    </button>
                </div>
                
                <div id="lendersDisplay" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                </div>
            </div>
        </div>

        <div id="productsContent" className="page-content">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Loan Products</h2>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                            🛒 7 Products
                        </span>
                    </div>
                </div>
                
                <div id="productsDisplay" className="grid grid-cols-1 md:grid-cols-2 gap-6">
                </div>
            </div>
        </div>

        <div id="applicationsContent" className="page-content">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Loan Applications</h2>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                            📝 All Applications
                        </span>
                    </div>
                </div>
                
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Search applications..." className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"/>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">All Loan Types</option>
                        <option value="fix-and-flip">Fix & Flip</option>
                        <option value="dscr">DSCR</option>
                        <option value="new-construction">New Construction</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">All Statuses</option>
                        <option value="waiting_on_term_sheets">Waiting on Term Sheets</option>
                        <option value="waiting_for_applicant_decision">Waiting for Applicant Decision</option>
                        <option value="signed_term_sheet">Signed Term Sheet</option>
                        <option value="application_paid">Application Paid</option>
                        <option value="awaiting_close">Awaiting Close</option>
                        <option value="closed_deal">Closed Deal</option>
                    </select>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                        🔍 Filter
                    </button>
                </div>
                
                
            </div>
        </div>

        
        <div id="applicationDetailsContent" className="page-content">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                        <button className="text-gray-600 hover:text-gray-900 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </button>
                        <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            📋 Application Review
                        </span>
                    </div>
                </div>
                
                <div id="applicationDetailsArea" className="space-y-6">
                   
                </div>
            </div>
        </div>

       
        <div id="adminContent" className="page-content">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                            👨‍💼 GetResFunding Team
                        </span>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl mb-2">📋</div>
                            <div className="font-semibold">Applications</div>
                            <div className="text-sm opacity-90">Review & Manage</div>
                        </div>
                    </button>
                    
                    <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl mb-2">📄</div>
                            <div className="font-semibold">Templates</div>
                            <div className="text-sm opacity-90">Term Sheet Templates</div>
                        </div>
                    </button>
                    
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl mb-2">📦</div>
                            <div className="font-semibold">Batches</div>
                            <div className="text-sm opacity-90">Term Sheet Batches</div>
                        </div>
                    </button>
                    
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg">
                        <div className="text-center">
                            <div className="text-2xl mb-2">➕</div>
                            <div className="font-semibold">New Template</div>
                            <div className="text-sm opacity-90">Create Template</div>
                        </div>
                    </button>
                </div>

                <div id="adminContentArea" className="bg-gray-50 rounded-lg p-6">
                    <div className="text-center text-gray-500">
                        <div className="text-4xl mb-4">👨‍💼</div>
                        <h3 className="text-xl font-semibold mb-2">Welcome to Admin Panel</h3>
                        <p className="text-gray-600">Select an action above to manage term sheets and applications.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center space-x-4">
                <button className="nav-button bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-green-500">
                    🌱 Seed Database
                </button>
                <button className="nav-button bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-cyan-500">
                    ❤️ Health Check
                </button>
                <button className="nav-button bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-red-500">
                    🧪 Test Navigation
                </button>
            </div>
        </div>
    </div>

  </div>;
}