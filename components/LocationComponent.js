import React, { useState, useEffect, useRef } from 'react';
import { Text, Button, View } from 'react-native';
//import { jsonToCSV } from 'react-native-csv';


import * as Location from 'expo-location';
/*import * as TaskManager from 'expo-task-manager';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import MapView, {UrlTile} from 'react-native-maps';*/

import PersonalisedButton from './PersonalisedButton';
import realtimeDataService, {get_bus_names_in_journey} from '../services/RealtimeDataService';
import locationService from '../services/LocationService';
import { selectedJourneyFromGlobal } from './GlobalContext';



function LocationComponent() {
    const [location, setLocation] = useState([]);
    const [isTracking, setIsTracking] = useState(false);
    const subscribedToLocation = useRef(null);

    const [startRecordLoading, setStartRecordLoading] = useState(false);
    const [sendingJourneyToServer, setSendingJourneyToServer] = useState(false);

    

    if (subscribedToLocation.current !== null){
        locationService.unsubscribe(subscribedToLocation.current);
    }
    
    subscribedToLocation.current = (newLocations) => {
        setLocation([...location, ...newLocations]);
    };
    locationService.subscribe(subscribedToLocation.current);


    const toggleTracking = async () => {

        
        if (isTracking) {
            
            locationService.stopService();
            realtimeDataService.stopService();
        
        } else {

            setStartRecordLoading(true);

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                alert("Permission to access location was denied");
                return;
            }
            console.log("status requestForegroundPermissionsAsync :", status);

            status = await Location.requestBackgroundPermissionsAsync();
            if (status.granted === false && status.status !== 'granted') {
                console.error('Permission to access background location was denied');
                alert("Permission to access background location was denied");
                return;
            }
            console.log("status requestBackgroundPermissionsAsync :", status);

            await locationService.startService();


            let [bus_names, ] = get_bus_names_in_journey();

            if (bus_names.length > 0){
                console.log("Bus detected in the journey : fetch realtime data");
                await realtimeDataService.fetchRealtimeData();
                await realtimeDataService.runService();
            }
            else {
                console.log("No bus detected in the journey");
            }
            
            setStartRecordLoading(false);
            
        }
        
        setIsTracking(!isTracking);
    };

    /*async function listFiles() {
        const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
        console.log(files);
    }*/

    /*async function saveFile(data) {
        //const gpsDataFilename = FileSystem.documentDirectory + "journey_gps.csv";
        const realtimeDataFilename = FileSystem.documentDirectory + "journey_data.json";

        await FileSystem.writeAsStringAsync(
            gpsDataFilename, 
            data, 
            { encoding: FileSystem.EncodingType.UTF8 }
        );

        
        await FileSystem.writeAsStringAsync(
            realtimeDataFilename,
            JSON.stringify({
                "journey": selectedJourneyFromGlobal.get(),
                "gps": data,
                "realtime": realtimeDataService.getAllrealtimeData(),
            }, null, 2),
            { encoding: FileSystem.EncodingType.UTF8 }
        );
        
      }*/

    async function shareData(text){

        setSendingJourneyToServer(true);

        str_body = JSON.stringify(
            {
                "journey": selectedJourneyFromGlobal.get(),
                "gps": text,
                "realtime": realtimeDataService.getAllrealtimeData(),
            }, 
            null, 
            2
        );

        console.log("Data to be send : ", str_body);

        await fetch(
            "https://step.tcdrail.com/api/journey_data", 
            {
                method: "POST",
                body: str_body,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }
        );

        setSendingJourneyToServer(false);
    }

    const exportLocationsToCsv = () => {


        /*let csv = "latitude,longitude,created\n";

        location.forEach((position) => {

            date = new Date(position.timestamp).toISOString();

            csv += `${position.coords.latitude},${position.coords.longitude},${date}\n`
        })
        shareData(csv);
        */

        let position_list = [];

        location.forEach((position) => {

            date = new Date(position.timestamp).toISOString();

            position_list.push([
                position.coords.longitude, 
                position.coords.latitude, 
                date
            ]);
        });
        shareData(position_list);
        console.log(position_list);
    }

    return (
        <View style={{flex: 1}}>
        {   
            <Text 
                style={{
                    fontSize:20
                }
                }
            > 
                Number of points recorded: {location.length}
            </Text>
            /*location.map((value, index) => {
                return (
                    <Text key={index}>
                        {location ? `Latitude : ${value.coords.latitude}, Longitude : ${value.coords.longitude}` : 'Loading...'}
                    </Text>
                );
            })*/
        }
            <PersonalisedButton
                onPress={toggleTracking}
                text={isTracking ? 'Stop Tracking' : 'Start Tracking'}
                loadAnimation={startRecordLoading}
            />

            <PersonalisedButton
                onPress={exportLocationsToCsv}
                text={"Send data to the server"}
                loadAnimation={sendingJourneyToServer}
            />
            

        </View>
    );
}

export default LocationComponent;
