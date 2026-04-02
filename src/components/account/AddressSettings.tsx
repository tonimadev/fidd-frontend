'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { accountService } from '@/lib/account-service';
import { Button } from '@/components/ui/Button';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: -23.5505, // São Paulo default
  lng: -46.6333,
};

const libraries: ("places")[] = ["places"];

export const AddressSettings: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number, lng: number } | null>(null);
  
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries,
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const data = await accountService.getProfile();
      if (data.address) {
        setSelectedAddress(data.address);
      }
      if (data.latitude && data.longitude) {
        setSelectedLocation({ lat: data.latitude, lng: data.longitude });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      setErrorMessage('Erro ao carregar dados do endereço.');
    } finally {
      setIsLoading(false);
    }
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || '';
        
        setSelectedLocation({ lat, lng });
        setSelectedAddress(address);
      }
    }
  };

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setSelectedLocation({ lat, lng });
      
      // Reverse geocoding to get address string
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          setSelectedAddress(results[0].formatted_address);
        }
      });
    }
  }, []);

  const handleSave = async () => {
    if (!selectedAddress || !selectedLocation) {
      setErrorMessage('Por favor, selecione um endereço no mapa ou use a busca.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      setSuccessMessage('');
      
      await accountService.updateAddress({
        address: selectedAddress,
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
      });
      
      setSuccessMessage('Endereço atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      setErrorMessage('Erro ao salvar endereço. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-4 text-center">Carregando mapa...</div>;
  }

  if (loadError) {
    return (
      <div className="p-6 text-center bg-red-50 rounded-lg border border-red-200">
        <h3 className="text-red-800 font-semibold">Erro ao carregar o Google Maps</h3>
        <p className="text-red-600 text-sm mt-2">
          Não foi possível carregar os serviços do Google Maps. Verifique sua conexão e se a chave de API está configurada corretamente.
        </p>
      </div>
    );
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="p-6 text-center bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-yellow-800 font-semibold">Configuração Pendente</h3>
        <p className="text-yellow-600 text-sm mt-2">
          A chave de API do Google Maps não foi encontrada. Por favor, configure a variável <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> no seu arquivo <code>.env.local</code>.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="p-4 text-center">Carregando Google Maps...</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Localização da Loja</h3>
        <p className="mt-1 text-sm text-gray-600">
          Defina o endereço da sua loja para que os clientes possam te encontrar no app.
        </p>
      </div>

      <div className="space-y-4">
        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <div className="relative">
          <Autocomplete
            onLoad={(autocomplete) => (autocompleteRef.current = autocomplete)}
            onPlaceChanged={onPlaceChanged}
          >
            <input
              type="text"
              placeholder="Digite o endereço da sua loja"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={selectedAddress}
              onChange={(e) => setSelectedAddress(e.target.value)}
            />
          </Autocomplete>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={selectedLocation || defaultCenter}
            zoom={15}
            onClick={onMapClick}
          >
            {selectedLocation && (
              <Marker position={selectedLocation} />
            )}
          </GoogleMap>
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
          >
            Salvar Endereço
          </Button>
        </div>
      </div>
    </div>
  );
};
