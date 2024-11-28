<template>
  <div>
    <section
      class="ui two column centered grid"
      style="position: relative; z-index: 1"
    >
      <div class="column">
        <form class="ui segment large form">
          <div class="ui message red" v-show="error">{{ error }}</div>
          <div class="ui segment">
            <div class="field">
              <div
                class="ui right icon input large"
                :class="{ loading: spinner }"
              >
                <input
                  type="text"
                  placeholder="Enter your address"
                  v-model="address"
                  @input="fetchSuggestions"
                  @focus="showSuggestions = true"
                />
                <i
                  class="dot circle link icon"
                  @click="locatorButtonPressed"
                ></i>
              </div>
              <div v-if="showSuggestions" class="suggestions">
                <div
                  v-for="suggestion in suggestions"
                  :key="suggestion.place_id"
                  class="suggestion-item"
                  @click="selectSuggestion(suggestion)"
                >
                  {{ suggestion.description }}
                </div>
              </div>
            </div>
            <div class="ui button">Go</div>
          </div>
        </form>
      </div>
    </section>

    <section id="map" style="width: 100%; height: 400px"></section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      address: "",
      error: "",
      spinner: false,
      suggestions: [],
      showSuggestions: false,
      latitude: 28.6109, // default latitude
      longitude: 77.0385, // default longitude
    };
  },
  methods: {
    locatorButtonPressed() {
      this.spinner = true;

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.getAddressFrom(
              position.coords.latitude,
              position.coords.longitude
            );

            this.showUserLocationOnTheMap(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          (error) => {
            this.error =
              "Locator is unable to find the address. Please type your address manually";
            this.spinner = false;
          }
        );
      } else {
        this.error = "Your browser does not support the geolocation API.";
        this.spinner = false;
      }
    },
    getAddressFrom(lat, long) {
      axios
        .get(
          `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${long}&api_key=rvwSRaMnQm0iC08KsNGWlxzx3Hl3hQJXpoqsytwU`
        )
        .then((response) => {
          if (response.data.error_message) {
            this.error = response.data.error_message;
          } else {
            this.address = response.data.results[0].formatted_address;
          }
          this.spinner = false;
        })
        .catch((error) => {
          this.error = error.message;
          this.spinner = false;
        });
    },
    fetchSuggestions() {
      if (this.address.length > 2) {
        axios
          .get(
            `https://api.olamaps.io/places/v1/autocomplete?input=${this.address}&origin=${this.latitude},${this.longitude}&location=${this.latitude},${this.longitude}&radius=1000&strictbounds=true&api_key=rvwSRaMnQm0iC08KsNGWlxzx3Hl3hQJXpoqsytwU`
          )
          .then((response) => {
            this.suggestions = response.data.predictions;
          })
          .catch((error) => {
            this.error = error.message;
          });
      }
    },
    selectSuggestion(suggestion) {
      this.address = suggestion.description;
      this.showSuggestions = false;
    },
    showUserLocationOnTheMap(latitude, longitude) {
      axios
        .get(
          `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=5spIZd2PLuYdQ7BzT6K7ZLXJkZBaV4qaos1MOYe3`
        )
        .then((response) => {
          console.log("Bhaiya map load nahi ho raha");
        })
        .catch((error) => {
          this.error = error.message;
        });

      // if (!window.olamaps || !document.getElementById("map")) {
      //   this.error =
      //     "Ola Maps library or map container is not properly loaded.";
      //   return;
      // }

      // const map = new window.olamaps.Map({
      //   container: "map", // The ID of the container where the map will be displayed
      //   style:
      //     "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      //   center: [longitude, latitude], // Initial center coordinates
      //   zoom: 12, // Initial zoom level
      //   transformRequest: (url, resourceType) => {
      //     url = url + "?api_key=5spIZd2PLuYdQ7BzT6K7ZLXJkZBaV4qaos1MOYe3";
      //     return { url, resourceType };
      //   },
      // });

      // const nav = new window.olamaps.NavigationControl({
      //   visualizePitch: true,
      // });
      // map.addControl(nav, "top-left");

      // const marker = new window.olamaps.Marker()
      //   .setLngLat([longitude, latitude])
      //   .addTo(map);
    },
  },
};
</script>

<style>
.ui.button,
.dot.circle.icon {
  background-color: #ff5a5f;
  color: white;
}

.suggestions {
  border: 1px solid #ddd;
  background: #fff;
  position: absolute;
  z-index: 1000;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
}

.suggestion-item:hover {
  background-color: #f0f0f0;
}

.pac-icon {
  display: none;
}

.pac-item {
  padding: 10px;
  font-size: 16px;
  cursor: pointer;
}

.pac-item:hover {
  background-color: #ececec;
}

.pac-item-query {
  font-size: 16px;
}

#map {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 400px;
}
</style>
