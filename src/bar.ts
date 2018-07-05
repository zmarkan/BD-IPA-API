export type OpeningHours = {
    day: string;
    times: string;
  };
  
export type Social = {
    network: string;
    handle: string;
    url: string;
  };
  
export type ContactDetails = {
    address: string[];
    email: string;
    telephone: string;
    location: {
      lat: string;
      lng: string;
    };
  };
  
export type Bar = {
    id: string;
    title: string;
    url: string;
  
    opening_hours?: OpeningHours[];
    social?: Social[];
    contact_details?: ContactDetails;
};