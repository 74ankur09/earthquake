import React, { useState, useEffect } from "react";

import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
var value = false;
function Map() {

  const [selectedLocation, setSelectedLocation] = useState();
  const [locations, setlocations] = useState([]);
  const [loaded, setloaded] = useState(false);
  console.log('main------------vale',value, loaded)


  function ColorToHex(color) {
    var hexadecimal = color.toString(16);
    return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
  }
  
  function ConvertRGBtoHex(red, green, blue) {
    return "#" + ColorToHex(red) + ColorToHex(green) + ColorToHex(blue);
  }
console.log('begin functionnnnnnnnnn', locations)
  useEffect(() => {
    console.log('begin use effect ' )
    console.log(locations )

    fetch("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson")
      .then(res => res.json())
      .then(
        (result) => {
          console.log('successssssssssssssssss')
          var p = result.features;
          console.log('before sorting')
          console.log(p);
          p.sort((a, b) => parseFloat(b.properties.mag) - parseFloat(a.properties.mag));
          console.log('after sorting')
          console.log(p);
          for(var i=0;i<=Math.min(255,p.length-1);i++){
            if(i==p.length-1)
            p[i].code = ConvertRGBtoHex(255,255,255);
            else if(i==0){
              console.log('000000000000000')
              p[i].code = "#FF0000"
            }
            else{
              p[i].code = ConvertRGBtoHex(i,i,i);
            }
            console.log(ConvertRGBtoHex(i,i,i));
          }
          setlocations(p);
        },
        (error) => {
          console.log('errorrrrrrrrrrrr')
          console.log(error)
        }
      )
      .finally(() => {
        console.log('inside finalltyyyyyyyyyyyyy')
        setloaded(true);
      });
  }, []);
  const svgMarker = {
    path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
    fillColor: "#000000",
    fillOpacity: 0.6,
    strokeWeight: 0,
    rotation: 0,
    scale: 2,
    opacity: 1,
  };
  if(!loaded){
    {console.log('heyyyy')}
    return <p></p>;
  }
  return (
      <>
   
    <GoogleMap
      defaultZoom={0}
      defaultCenter={{ lat: locations[0].geometry.coordinates[1],lng : locations[0].geometry.coordinates[0] }}
      
    > 
      {
      locations.map(location => ( 
        
        <Marker
          key={location.properties.id}
          position={{
            lat: location.geometry.coordinates[1],
            lng: location.geometry.coordinates[0]
          }}
          onClick={() => {
            setSelectedLocation(location);
          }}


          icon =
          {
            {
            path: 'm 12,2.4000002 c -2.7802903,0 -5.9650002,1.5099999 -5.9650002,5.8299998 0,1.74375 1.1549213,3.264465 2.3551945,4.025812 1.2002732,0.761348 2.4458987,0.763328 2.6273057,2.474813 L 12,24 12.9825,14.68 c 0.179732,-1.704939 1.425357,-1.665423 2.626049,-2.424188 C 16.809241,11.497047 17.965,9.94 17.965,8.23 17.965,3.9100001 14.78029,2.4000002 12,2.4000002 Z',
            fillColor: location.code,
            fillOpacity: 1.0,
            strokeWeight: 1,
            scale: 2,
            }
        } 
        />
        
      )) 
    
    }

      {selectedLocation && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedLocation(null);
          }}
          position={{
            lat: selectedLocation.geometry.coordinates[1],
            lng: selectedLocation.geometry.coordinates[0]
          }}
        >
          <div>
            <h2>{selectedLocation.properties.place}</h2>
            <p>{selectedLocation.properties.type}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
    </>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {console.log('wrapper')}
      
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.REACT_APP_GOOGLE_KEY}`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
      {console.log('wwwwwwwwwwwwww')}
    </div>
  );
}
