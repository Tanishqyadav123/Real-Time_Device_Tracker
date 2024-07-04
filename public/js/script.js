// Initialize / or sending a request to the backend :-
const socket = io();

// Step - 1 :- Check whether your broswer supports the geolocation stuff :-

if (navigator.geolocation) {
    
    navigator.geolocation.watchPosition((position) => {
        
         const {latitude , longitude} = position.coords
         console.log("Position Coordinates " , position.coords)
         console.log("Position timeStamps " , position.timestamp)

        //  Emit an event :- send-location
        socket.emit ("send-location" , {latitude , longitude})

    } , (error) =>{
        console.error("Some Error Occured while sending the postion Coordinates :  ", error) 
    } , { maximumAge : 0 , timeout : 5000 , enableHighAccuracy : true })

}



// Step - 2 :- Set up the map with default co-ordinates (0,0) 

const map = L.map("myMap").setView ([0,0] , 10);  // Allowed Location Access 

L.tileLayer ("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" , {
     attribution : "Tanishq Yadav"
}).addTo(map)


// Create the marker 
const  markers = {}

socket.on("receive-location" , (LocationData) =>{
    const {id , latitude , longitude} = LocationData
    console.log(latitude , longitude)
    map.setView([latitude , longitude])
    
     if (markers[id]) {

         markers[id].setLatLng ([latitude , longitude])

     }
     else {
         markers[id] =  L.marker([latitude , longitude] ).addTo(map)
     }

     console.log(markers)
})


socket.on("remove-marker" , (id) =>{
     if (markers[id]) {
         map.removeLayer(markers[id])
         delete markers[id]
     }

     
})