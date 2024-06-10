import React, { useState, useRef, useContext, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet,TouchableOpacity  } from 'react-native';

import { WebView } from 'react-native-webview';

import locationService from '../services/LocationService';


export default function MapComponent(){

    const recovered_starting_points = useRef(false)
    const webviewRef = useRef(null);
    const subscribedToLocation = useRef(null);

    const sendDataToWebView = (lat, long) => {
        console.log("script a executer");
        const script = `
            L.marker([${lat}, ${long}]).addTo(map);
            `;
        
        if ( webviewRef.current !== null){
            webviewRef.current.injectJavaScript(script);
            console.log("fin");
        }
    };

    useEffect(
        () => {
            setTimeout( () => {
                const missed_locations = locationService.getAllGpsData();
                console.log(missed_locations.length, "missed locations");
                missed_locations.forEach(location => {
                    sendDataToWebView(
                        location.coords.latitude, 
                        location.coords.longitude
                    );
                });
            },
            1000
        )   
        },
        [webviewRef]

    )

    if (subscribedToLocation.current !== null){
        locationService.unsubscribe(subscribedToLocation.current);
    }
    else {
        
        

    }
    
    subscribedToLocation.current = (newLocations) => {
        newLocations.forEach(location => {
            sendDataToWebView(
                location.coords.latitude, 
                location.coords.longitude
            );
        });
    };
    locationService.subscribe(subscribedToLocation.current);

    


    return (

        //<Text> C'est la map !!</Text>
        <>
        <WebView
            ref={webviewRef}
            originWhitelist={['*']}
            source={{ html: `
                <!DOCTYPE html>
                <html>

                <head>
                <title>Leaflet Map for displaying journey</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link 
                    rel="stylesheet" 
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
                    crossorigin="" />
		        <script 
                    src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" 
                    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" 
                    crossorigin=""></script>
                
                </head>

                <body style="margin:0">
                <div id="mapid" style="width: 100%; height: 100vh;"></div>
                <script>
                    var map = L.map('mapid').setView([53.345, -6.262], 13);
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);
                </script>
                </body>
                </html>
            ` }}
            style={{  flex: 1, margin: 0}}
        />


        </>
    );
}


