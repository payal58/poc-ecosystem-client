'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default marker icon in Next.js
if (typeof window !== 'undefined') {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  })
}

export default function Map({ latitude, longitude, organizationName }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([parseFloat(latitude), parseFloat(longitude)], 13)

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add marker
      const marker = L.marker([parseFloat(latitude), parseFloat(longitude)])
        .addTo(map)
        .bindPopup(organizationName || 'Organization Location')
        .openPopup()

      mapInstanceRef.current = map
      markerRef.current = marker
    } else {
      // Update map center and marker position if coordinates change
      const lat = parseFloat(latitude)
      const lng = parseFloat(longitude)
      mapInstanceRef.current.setView([lat, lng], 13)
      
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng])
        markerRef.current.setPopupContent(organizationName || 'Organization Location')
      }
    }

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [latitude, longitude, organizationName])

  if (!latitude || !longitude) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
        No coordinates available
      </div>
    )
  }

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
}

