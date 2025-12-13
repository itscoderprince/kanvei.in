"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import { useAuth } from "../../contexts/AuthContext"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  Save,
  X,
  ShieldCheck,
  Mail,
  Phone,
  Home,
  CheckCircle,
  CreditCard
} from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { user: authUser, isAuthenticated: customAuth, token: authToken, logout } = useAuth()

  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  // Interaction States
  const [editMode, setEditMode] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState(null)

  // Data States
  const [profileData, setProfileData] = useState({ name: "", email: "", phone: "" })
  const [addresses, setAddresses] = useState([])
  const [addressCount, setAddressCount] = useState(0)
  const [maxAddresses, setMaxAddresses] = useState(3)

  // Form States
  const [tempProfile, setTempProfile] = useState({})
  const [addressForm, setAddressForm] = useState({
    street: "", city: "", state: "", pinCode: "", isHomeAddress: false
  })

  const currentUser = session?.user || authUser
  const isUserAuthenticated = (status === "authenticated") || customAuth

  // Auth Check
  useEffect(() => {
    if (status === "loading") return
    if (!isUserAuthenticated) {
      router.push('/login')
      return
    }
    if (currentUser?.role === "admin") {
      router.push('/admindashboard')
      return
    }
    setLoading(false)
  }, [status, isUserAuthenticated, currentUser, router])

  // Data Fetching
  useEffect(() => {
    if (!currentUser?._id && !currentUser?.id) return

    const fetchData = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (authToken && authToken !== 'nextauth_session') headers.Authorization = `Bearer ${authToken}`

        const [profileRes, addrRes] = await Promise.all([
          fetch('/api/user/profile', { headers }),
          fetch('/api/user/addresses', { headers })
        ])

        const profileData = await profileRes.json()
        const addrData = await addrRes.json()

        if (profileData.success) {
          setProfileData({
            name: profileData.user.name || "",
            email: profileData.user.email || "",
            phone: profileData.user.phone || ""
          })
        }
        if (addrData.success) {
          setAddresses(addrData.addresses || [])
          setAddressCount(addrData.count || 0)
          setMaxAddresses(addrData.maxAddresses || 3)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load profile data')
      }
    }

    if (isUserAuthenticated && !loading) fetchData()
  }, [currentUser, isUserAuthenticated, loading, authToken])

  // Handlers
  const handleEditProfile = () => {
    setTempProfile({ name: profileData.name, phone: profileData.phone })
    setEditMode(true)
  }

  const handleSaveProfile = async () => {
    if (!tempProfile.name?.trim()) return toast.error('Name is required')
    setUpdating(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (authToken && authToken !== 'nextauth_session') headers.Authorization = `Bearer ${authToken}`

      const res = await fetch('/api/user/profile', {
        method: 'PUT', headers,
        body: JSON.stringify({ name: tempProfile.name, phone: tempProfile.phone })
      })
      const data = await res.json()

      if (data.success) {
        setProfileData(prev => ({ ...prev, ...tempProfile }))
        setEditMode(false)
        toast.success('Profile updated!')
      } else {
        toast.error(data.error || 'Update failed')
      }
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleAddressSubmit = async () => {
    if (!addressForm.city?.trim()) return toast.error('City is required')
    setUpdating(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (authToken && authToken !== 'nextauth_session') headers.Authorization = `Bearer ${authToken}`

      const url = '/api/user/addresses'
      const method = editingAddressId ? 'PUT' : 'POST'
      const body = editingAddressId ? { ...addressForm, addressId: editingAddressId } : addressForm

      const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
      const data = await res.json()

      if (data.success) {
        setAddresses(data.addresses || [])
        setAddressCount(data.count || 0)
        setShowAddressForm(false)
        setEditingAddressId(null)
        setAddressForm({ street: "", city: "", state: "", pinCode: "", isHomeAddress: false })
        toast.success(data.message || 'Address saved!')
      } else {
        toast.error(data.error || 'Address save failed')
      }
    } catch (err) {
      toast.error('Failed to save address')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    if (!confirm('Delete this address?')) return
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (authToken && authToken !== 'nextauth_session') headers.Authorization = `Bearer ${authToken}`

      const res = await fetch(`/api/user/addresses?id=${id}`, { method: 'DELETE', headers })
      const data = await res.json()

      if (data.success) {
        setAddresses(data.addresses || [])
        setAddressCount(data.count || 0)
        toast.success('Address deleted')
      } else {
        toast.error(data.error || 'Delete failed')
      }
    } catch (err) {
      toast.error('Failed to delete address')
    }
  }

  const startEditAddress = (addr) => {
    setAddressForm({
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pinCode: addr.pinCode || "",
      isHomeAddress: addr.isHomeAddress || false
    })
    setEditingAddressId(addr._id)
    setShowAddressForm(true)
  }

  // Loading State
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#5A0117] border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  if (!isUserAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 bg-[#5A0117] rounded-full flex items-center justify-center text-white text-2xl font-sugar shadow-lg shadow-[#5A0117]/30">
                    {profileData.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h2 className="font-bold text-[#5A0117] font-sugar text-lg leading-tight">Hello,</h2>
                    <p className="text-gray-600 truncate max-w-[150px]">{profileData.name || 'User'}</p>
                  </div>
                </div>

                <nav className="space-y-2">
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 bg-[#5A0117]/5 text-[#5A0117] rounded-xl font-medium transition-colors">
                    <User className="w-5 h-5" /> My Profile
                  </Link>
                  <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#5A0117] rounded-xl font-medium transition-colors">
                    <ShoppingBag className="w-5 h-5" /> My Orders
                  </Link>
                  <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#5A0117] rounded-xl font-medium transition-colors">
                    <Heart className="w-5 h-5" /> Wishlist
                  </Link>
                  <Link href="/cart" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#5A0117] rounded-xl font-medium transition-colors">
                    <CreditCard className="w-5 h-5" /> Saved Cards
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors mt-6 text-left">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">

              {/* Identity Card Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-[#5A0117] to-[#8C6141] p-6 text-white flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold font-sugar mb-1">Personal Info</h2>
                    <p className="opacity-90 text-sm">Manage your personal identification details</p>
                  </div>
                  {!editMode ? (
                    <button onClick={handleEditProfile} className="bg-white/20 hover:bg-white/30 p-2 rounded-lg backdrop-blur-sm transition-colors">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} disabled={updating} className="bg-white text-[#5A0117] px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-100 transition-colors">
                        {updating ? 'Saving...' : 'Save'}
                      </button>
                      <button onClick={() => setEditMode(false)} className="bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Full Name</label>
                      {editMode ? (
                        <input
                          type="text"
                          value={tempProfile.name || ''}
                          onChange={e => setTempProfile(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5A0117] focus:ring-2 focus:ring-[#5A0117]/20 outline-none transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-3 text-lg font-medium text-gray-800 border-b border-gray-100 pb-2">
                          <User className="w-5 h-5 text-[#8C6141]" /> {profileData.name || 'Not Set'}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Email Address</label>
                      <div className="flex items-center gap-3 text-lg font-medium text-gray-800 border-b border-gray-100 pb-2 bg-gray-50/50 rounded px-2 cursor-not-allowed opacity-75">
                        <Mail className="w-5 h-5 text-[#8C6141]" />
                        <span className="truncate">{profileData.email}</span>
                        {currentUser?.emailVerified && <ShieldCheck className="w-4 h-4 text-green-500 ml-auto" />}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Phone Number</label>
                      {editMode ? (
                        <input
                          type="tel"
                          value={tempProfile.phone || ''}
                          onChange={e => setTempProfile(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5A0117] focus:ring-2 focus:ring-[#5A0117]/20 outline-none transition-all"
                        />
                      ) : (
                        <div className="flex items-center gap-3 text-lg font-medium text-gray-800 border-b border-gray-100 pb-2">
                          <Phone className="w-5 h-5 text-[#8C6141]" /> {profileData.phone || 'Not Set'}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>

              {/* Addresses Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold font-sugar text-[#5A0117]">My Addresses</h2>
                    <p className="text-gray-500 text-sm">Manage shipping locations ({addressCount}/{maxAddresses})</p>
                  </div>
                  {!showAddressForm && addressCount < maxAddresses && (
                    <button
                      onClick={() => {
                        setAddressForm({ street: "", city: "", state: "", pinCode: "", isHomeAddress: false })
                        setEditingAddressId(null)
                        setShowAddressForm(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-[#5A0117] text-white rounded-lg hover:bg-[#4a0113] transition-colors shadow-lg shadow-[#5A0117]/20 font-medium text-sm"
                    >
                      <Plus className="w-4 h-4" /> Add New
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {showAddressForm ? (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-in fade-in slide-in-from-top-4 duration-300">
                      <h3 className="font-bold text-[#5A0117] mb-4 flex items-center gap-2">
                        {editingAddressId ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        {editingAddressId ? 'Edit Address' : 'Add New Address'}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="md:col-span-2">
                          <input
                            placeholder="Street Address, Apt, Suite"
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5A0117] focus:ring-2 focus:ring-[#5A0117]/20 outline-none"
                            value={addressForm.street}
                            onChange={e => setAddressForm(prev => ({ ...prev, street: e.target.value }))}
                          />
                        </div>
                        <input
                          placeholder="City"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5A0117] focus:ring-2 focus:ring-[#5A0117]/20 outline-none"
                          value={addressForm.city}
                          onChange={e => setAddressForm(prev => ({ ...prev, city: e.target.value }))}
                        />
                        <input
                          placeholder="State"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5A0117] focus:ring-2 focus:ring-[#5A0117]/20 outline-none"
                          value={addressForm.state}
                          onChange={e => setAddressForm(prev => ({ ...prev, state: e.target.value }))}
                        />
                        <input
                          placeholder="PIN Code"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#5A0117] focus:ring-2 focus:ring-[#5A0117]/20 outline-none"
                          value={addressForm.pinCode}
                          onChange={e => setAddressForm(prev => ({ ...prev, pinCode: e.target.value }))}
                        />
                        <div className="md:col-span-2 flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="isHome"
                            checked={addressForm.isHomeAddress}
                            onChange={e => setAddressForm(prev => ({ ...prev, isHomeAddress: e.target.checked }))}
                            className="w-4 h-4 text-[#5A0117] focus:ring-[#5A0117] border-gray-300 rounded"
                          />
                          <label htmlFor="isHome" className="text-gray-700 font-medium text-sm">Mark as default home address</label>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button onClick={handleAddressSubmit} disabled={updating} className="px-6 py-2 bg-[#5A0117] text-white rounded-lg font-medium hover:bg-[#4a0113] transition-colors shadow-lg shadow-[#5A0117]/20">
                          {updating ? 'Saving...' : 'Save Address'}
                        </button>
                        <button onClick={() => setShowAddressForm(false)} className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.length === 0 ? (
                        <div className="md:col-span-2 text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 mb-4">No addresses saved yet</p>
                          <button
                            onClick={() => {
                              setAddressForm({ street: "", city: "", state: "", pinCode: "", isHomeAddress: false })
                              setEditingAddressId(null)
                              setShowAddressForm(true)
                            }}
                            className="text-[#5A0117] font-bold hover:underline"
                          >
                            Add your first address
                          </button>
                        </div>
                      ) : (
                        addresses.map(addr => (
                          <div key={addr._id} className="border border-gray-200 rounded-xl p-5 hover:border-[#5A0117]/50 hover:shadow-lg transition-all group relative">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEditAddress(addr)} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDeleteAddress(addr._id)} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="mb-3">
                              {addr.isHomeAddress && (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider rounded-md mb-2">
                                  <Home className="w-3 h-3" /> Home
                                </span>
                              )}
                              <p className="font-bold text-gray-800">{addr.city}, {addr.state}</p>
                            </div>
                            <p className="text-gray-500 text-sm leading-relaxed mb-1">
                              {addr.street}
                            </p>
                            <p className="text-gray-500 text-sm font-mono">
                              PIN: {addr.pinCode}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
