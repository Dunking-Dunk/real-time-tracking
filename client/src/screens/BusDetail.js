import { Text, View, StyleSheet } from "react-native";
import { useState } from "react";
import { Map } from "../components/MapView";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import Loader from "../components/LoadingAnimation";
import DragUpView from "../components/DragUpView";
import Color from "../utils/Color";
import StepProgressBar from "../components/StepProgressBar";
import { clientSocket } from "../api/socket";

import CustomButton from "../components/CustomButton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { CalcDistance } from "../utils/distanceBetweenCoords";
import { getDistanceAndTime } from "../utils/getDistanceAndTime";

const BusDetail = ({ navigation, route }) => {
  const routeData = route.params;
  const dispatch = useDispatch()
  const appState = useSelector((state) => state.user.appState);

  let bus = routeData.bus
    ? routeData.bus
    : useSelector((state) => state.buses.bus);

  const distanceTime = getDistanceAndTime(bus.stops_distance_time)
  
  const [routeInfo, setRouteInfo] = useState({
    distance: 0,
    elapsedTime: 0,
  });
  

  useEffect(() => {
    if (bus) {
      if (appState === "active")
        clientSocket.getBusLocation(bus.tracker, dispatch);
      else clientSocket.stopBusLocation(bus.tracker);

      return () => {
        clientSocket.stopBusLocation(bus.tracker);
      };
    }
  }, [bus, appState]);



  if (bus) {
    return (
      <View style={styles.container}>
        <CustomButton
          onPress={() => navigation.pop()}
          style={styles.headerMenuContainer}
        >
          <AntDesign name="arrowleft" size={24} color={Color.bold} />
        </CustomButton>

        {routeInfo ? (
          <Map
            stops={bus?.stops}
            mapStyle={styles.map}
            busLiveLocation={routeData.busId}
            detail={true}
            busPoly={bus.stops_polyline}
          />
        ) : (
          <Loader size="large" />
        )}

        <DragUpView>
          <View style={styles.busContainer}>
            <View style={styles.routeInfoContainer}>
              <Text style={styles.routeInfoText}>
                {distanceTime[0]} KM
              </Text>
              <Text style={styles.routeInfoText}>
                {distanceTime[1]} 
              </Text>
            </View>

            <View style={styles.detailContainer}>
              <Text style={styles.busNumber}>
                {bus.busNumber}
                {bus.busSet && bus.busSet}
              </Text>
              <Text style={styles.busText}>{bus.busName}</Text>
            </View>
            <View style={styles.detailContainer}>
              <Text style={styles.busText}>
                <Text style={styles.textBold}>Total Seats: </Text> {bus.seats}{" "}
                <MaterialCommunityIcons
                  name="seat"
                  size={24}
                  color={Color.bold}
                />
              </Text>
              <Text style={styles.textBold}>{bus.ac ? "AC" : "NON-AC"}</Text>
            </View>
            <Text style={styles.busText}>{bus.description}</Text>
            <Text style={styles.busText}>
              {bus.status ? (
                <AntDesign name="checkcircle" size={20} color="green" />
              ) : (
                <AntDesign name="minuscircle" size={20} color="red" />
              )}
            </Text>

            <View style={{width: '100%', height: '100%',marginTop: 10, paddingBottom: 160}}>
              <StepProgressBar distance_time={bus.stops_distance_time} steps={bus.stops} />
            </View>
          </View>
        </DragUpView>
      </View>
    );
  } else {
    return <Loader size="large" />;
  }
};

export default BusDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  headerMenuContainer: {
    zIndex: 1,
    position: "absolute",
    top: 60,
    left: 15,
    borderRadius: 50,
    padding: 10,
    backgroundColor: Color.semiBold,
  },

  busContainer: {
    padding: 20,
    flex: 1,
  },
  routeInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 10,
  },
  routeInfoText: {
    backgroundColor: Color.bold,
    padding: 10,
    borderRadius: 5,
    color: Color.white,
  },

  detailContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  busNumber: {
    fontSize: 24,
    textTransform: "uppercase",
    color: Color.white,
  },
  busText: {
    marginBottom: 3,
    color: Color.white,
    fontSize: 16,
    textTransform: "capitalize",
  },
  textBold: {
    fontWeight: "bold",
    color: Color.white,
  },
  stopContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
     },
  stopCard: {
    width: '100%',
    gap: 5,
  },
  stopText: {
    color: Color.white
  },
});
