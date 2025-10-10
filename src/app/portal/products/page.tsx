
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardAction } from "@/components/ui/card"

export default function ProductsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto px-6 py-8 pb-24">
                <div id="productsContent" className="page-content">
                    <div className="bg-gradient-to-br from-orange-50/30 to-white rounded-2xl shadow-lg p-8 border border-orange-100">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Loan Products
              </h2>
                                <p className="text-gray-600">Explore our comprehensive range of lending solutions</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-orange-100 text-orange-800 border border-orange-200">
                                    🛒 2 Products
                                </span>
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                    ✅ All Active
                </span>
              </div>
            </div>

                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-700 text-sm font-medium">Fix & Flip</span>
                                <span className="px-3 py-1 rounded-full bg-white border border-orange-200 text-orange-700 text-sm font-medium">DSCR</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-medium">
                                    Sort by Type
                                </button>
                                <button className="px-4 py-2 rounded-lg border border-orange-200 text-orange-700 bg-orange-50 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-medium">
                                    Add Product
                                </button>
                            </div>
                        </div>

                        <div id="productsDisplay" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Fix & Flip Product Card */}
                            <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                                            <span className="text-white font-bold text-2xl">🏠</span>
                                        </div>
                                        <CardAction>
                                            <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">Active</span>
                                        </CardAction>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">Fix & Flip Loans</CardTitle>
                                    <CardDescription className="text-gray-600">Short-term financing for property rehabilitation and resale projects</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Interest Rate:</span>
                                            <span className="text-gray-900 font-bold text-lg">8.5% - 12%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Term Length:</span>
                                            <span className="text-gray-900 font-bold">6-18 months</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Max LTV:</span>
                                            <span className="text-gray-900 font-bold">85%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600 font-medium">Min Credit Score:</span>
                                            <span className="text-gray-900 font-bold">650</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                        View Details
                                    </button>
                                </CardFooter>
                            </Card>

                            {/* DSCR Product Card */}
                            <Card className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-orange-200 group">
                                <CardHeader>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                                            <span className="text-white font-bold text-2xl">💰</span>
                                        </div>
                                        <CardAction>
                                            <span className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">Active</span>
                                        </CardAction>
                                    </div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-orange-700 transition-colors">DSCR Loans</CardTitle>
                                    <CardDescription className="text-gray-600">Debt service coverage ratio loans for investment properties</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Interest Rate:</span>
                                            <span className="text-gray-900 font-bold text-lg">6.5% - 9.5%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Term Length:</span>
                                            <span className="text-gray-900 font-bold">30 years</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                            <span className="text-gray-600 font-medium">Max LTV:</span>
                                            <span className="text-gray-900 font-bold">80%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-600 font-medium">Min Credit Score:</span>
                                            <span className="text-gray-900 font-bold">680</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                                        View Details
                                    </button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
          </div>
        </div>
        </div>
    )
}
