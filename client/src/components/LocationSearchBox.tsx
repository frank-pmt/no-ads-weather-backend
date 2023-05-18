import { AutoComplete } from 'primereact/autocomplete';
import { ChangeEvent, FormEvent, useState } from 'react';
import axios from 'axios';

export interface LocationSearchBoxProps {
  onLocationChange(event: FormEvent): void;
}

interface LocationResponseItem {
  name: string;
  fullName: string;
  latitude?: string;
  longitude?: string;
}

function LocationSearchBox({ onLocationChange }: LocationSearchBoxProps) {

  const [location, setLocation] = useState<LocationResponseItem>({ name: '', fullName: '' });
  const [items, setItems] = useState<LocationResponseItem[]>([]);

  const searchItems = (event: any) => {
    let query = event.query;
    const url = `/api/location/search?q=${query}`;
    axios.get<LocationResponseItem[]>(url,
      {
        headers: {
          Accept: 'application/json',
        },
      }).then(({ data, status }: { data: LocationResponseItem[], status: number }) => {
        setItems(data);
      }, (error: any) => {
        setItems([]);
        console.log(error);
      });
  }

  return (

    <AutoComplete field="fullName" value={location} suggestions={items} completeMethod={searchItems} onChange={(e: any) => {
      setLocation(e.value);
      onLocationChange(e);
    }} />

  )

}

export default LocationSearchBox;