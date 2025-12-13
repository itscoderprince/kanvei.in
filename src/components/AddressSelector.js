"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import { Plus, MapPin, Home, Briefcase, Trash2, Edit2, CheckCircle, Smartphone, User } from "lucide-react"

export default function AddressSelector({
  selectedAddress,
  onAddressSelect,
  onManualAddress,
  showManualForm = false,
  manualFormData = {},
  onManualFormChange
}) {
  const { data: session } = useSession()
  const { user: authUser, isAuthenticated: customAuth, token: authToken } = useAuth()

  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    state: "",
    pinCode: "",
    isHomeAddress: false
  })
  const [saving, setSaving] = useState(false)

  const currentUser = session?.user || authUser
  const isUserAuthenticated = (session?.status === "authenticated") || customAuth

  // Fetch user addresses
  useEffect(() => {
    if (!isUserAuthenticated || !currentUser) {
      setLoading(false)
      return
    }

    const fetchAddresses = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (authToken && authToken !== 'nextauth_session') {
          headers.Authorization = `Bearer ${authToken}`
        }

        const response = await fetch('/api/user/addresses', { headers })
        const data = await response.json()

        if (data.success) {
          setAddresses(data.addresses || [])
          // Auto-select home address if available
          const homeAddress = data.addresses?.find(addr => addr.isHomeAddress)
          if (homeAddress && !selectedAddress) {
            onAddressSelect(homeAddress)
          }
        } else {
          console.error('Error fetching addresses:', data.error)
        }
      } catch (error) {
        console.error('Error fetching addresses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAddresses()
  }, [isUserAuthenticated, currentUser, authToken])

  const handleAddAddress = async () => {
    if (!newAddress.city.trim()) {
      toast.error('City is required')
      return
    }

    setSaving(true)
    try {
      const headers = { 'Content-Type': 'application/json' }
      if (authToken && authToken !== 'nextauth_session') {
        headers.Authorization = `Bearer ${authToken}`
      }

      const response = await fetch('/api/user/addresses', {
        method: 'POST',
        headers,
        body: JSON.stringify(newAddress)
      })

      const data = await response.json()
      if (data.success) {
        setAddresses(data.addresses || [])
        setShowAddForm(false)
        setNewAddress({
          street: "",
          city: "",
          state: "",
          pinCode: "",
          isHomeAddress: false
        })
        toast.success('Address added successfully!')

        // Auto-select the new address
        const newAddr = data.addresses?.find(addr =>
          addr.street === newAddress.street &&
          addr.city === newAddress.city &&
          addr.pinCode === newAddress.pinCode
        )
        if (newAddr) {
          onAddressSelect(newAddr)
        }
      } else {
        toast.error(data.error || 'Failed to add address')
      }
    } catch (error) {
      console.error('Error adding address:', error)
      toast.error('Failed to add address')
    } finally {
      setSaving(false)
    }
  }

  const formatAddress = (address) => {
    const parts = []
    if (address.street) parts.push(address.street)
    parts.push(address.city)
    if (address.state) parts.push(address.state)
    if (address.pinCode) parts.push(address.pinCode)
    return parts.join(', ')
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-100 rounded-xl"></div>
            <div className="h-24 bg-gray-100 rounded-xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "Sugar, serif", color: "#1F2937" }}>
          <MapPin className="w-5 h-5 text-[#5A0117]" />
          Delivery Address
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onManualAddress(!showManualForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <Edit2 className="w-3.5 h-3.5" />
            {showManualForm ? 'Hide Manual' : 'Manual Entry'}
          </button>

          {isUserAuthenticated && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#5A0117] bg-red-50 hover:bg-red-100 rounded-full transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Plus className="w-4 h-4" />
              Add Address
            </button>
          )}
        </div>
      </div>

      {/* Add New Address Form */}
      {showAddForm && (
        <div className="mb-6 p-5 border border-gray-200 rounded-xl bg-gray-50/50">
          <h3 className="text-sm font-bold text-gray-900 mb-4">New Address Details</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Street Address</label>
              <textarea
                value={newAddress.street}
                onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                rows="2"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                placeholder="Flat No, Building, Street Area"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">City</label>
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">State</label>
                <input
                  type="text"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                  placeholder="State"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">PIN Code</label>
                <input
                  type="text"
                  value={newAddress.pinCode}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, pinCode: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                  placeholder="Six Digit PIN"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer mt-5">
                <input
                  type="checkbox"
                  checked={newAddress.isHomeAddress}
                  onChange={(e) => setNewAddress(prev => ({ ...prev, isHomeAddress: e.target.checked }))}
                  className="rounded text-[#5A0117] focus:ring-[#5A0117]"
                />
                <span className="text-sm text-gray-700">Set as default address</span>
              </label>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddAddress}
                disabled={saving}
                className="flex-1 bg-[#5A0117] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#720e26] transition-colors disabled:opacity-70"
              >
                {saving ? 'Saving...' : 'Save Address'}
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Addresses List */}
      {isUserAuthenticated && addresses.length > 0 && (
        <div className="space-y-3 mb-6">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => onAddressSelect(address)}
              className={`relative p-4 border rounded-xl cursor-pointer transition-all duration-200 group ${selectedAddress?._id === address._id
                ? 'border-[#5A0117] bg-red-50/30 ring-1 ring-[#5A0117]'
                : 'border-gray-200 hover:border-[#5A0117]/50 hover:shadow-sm'
                }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${selectedAddress?._id === address._id
                  ? 'border-[#5A0117] bg-[#5A0117]'
                  : 'border-gray-300'
                  }`}>
                  {selectedAddress?._id === address._id && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-gray-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {address.isHomeAddress ? 'Home' : 'Work/Other'}
                    </span>
                    {address.isHomeAddress && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#5A0117] text-white rounded">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {formatAddress(address)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Address Toggle */}


      {/* Manual Address Form */}
      {showManualForm && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Address *</label>
              <textarea
                name="address"
                value={manualFormData.address || ""}
                onChange={onManualFormChange}
                required
                rows={2}
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                placeholder="House No, Street, Area"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
              <input
                type="text"
                name="city"
                value={manualFormData.city || ""}
                onChange={onManualFormChange}
                required
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                placeholder="City"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">State *</label>
              <input
                type="text"
                name="state"
                value={manualFormData.state || ""}
                onChange={onManualFormChange}
                required
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                placeholder="State"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">PIN Code *</label>
              <input
                type="text"
                name="pincode"
                value={manualFormData.pincode || ""}
                onChange={onManualFormChange}
                required
                className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117]"
                placeholder="PIN Code"
              />
            </div>
          </div>
        </div>
      )}

      {!isUserAuthenticated && (
        <div className="mt-6 p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-blue-800">Save time on your next order</h4>
            <p className="text-xs text-blue-600 mt-0.5">Log in to save your address securely for faster checkout.</p>
          </div>
        </div>
      )}
    </div>
  )
}
