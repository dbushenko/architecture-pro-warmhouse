(ns temperature-api.core
  (:gen-class)
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.adapter.jetty :as jetty]
            [ring.middleware.json :as middleware]
            [ring.middleware.params :refer [wrap-params]] ; <-- 1. ДОБАВИТЬ ЭТО
            [cheshire.core :as json]))

(def locations
{"1" "Living Room"
 "2" "Bedroom"
 "3" "Kitchen"
 :default "Unknown" })

(def sensors
  {"Living Room" "1"
   "Bedroom" "2"
   "Kitchen" "3"
 :default "0" })


(defn get-current-temperature []
  "Simulates fetching temperature from a sensor.
   Returns a random temperature between 18 and 25."
  (let [base-temp 18
        temp-range 7
        random-temp (+ base-temp (rand temp-range))]
    (format "%.1f" random-temp)))

(defroutes app-routes
  (GET "/health" []
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string {:status "ok"})})

  (GET "/temperature/:id" [id]
    {:status 200
     :headers {"Content-Type" "application/json"}
     :body (json/generate-string {:value (Double/parseDouble (get-current-temperature))
                                  :sensorId id
                                  :location (or (get locations (str id)) (:default locations))})})
  
  (GET "/temperature" request
    (let [location (get-in request [:params "location"])]
      {:status 200
       :headers {"Content-Type" "application/json"}
       :body (json/generate-string {:value (Double/parseDouble (get-current-temperature))
                                    :location location
                                    :sensorId (or (get sensors location) (:default sensors))})}))
  
  (route/not-found "Not Found"))

(defn app []
  (-> (routes app-routes)
      (wrap-params {:keywords? true})
      (middleware/wrap-json-body {:keywords? true})
      (middleware/wrap-json-response)))

(defn -main [& args]
  (let [port (or (first args) (Integer/parseInt (or (System/getenv "PORT") "8081")))]
    (jetty/run-jetty (app) {:port port})))
