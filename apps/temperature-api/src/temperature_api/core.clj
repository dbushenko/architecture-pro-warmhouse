(ns temperature-api.core
  (:gen-class)
  (:require [compojure.core :refer :all]
            [compojure.route :as route]
            [ring.adapter.jetty :as jetty]
            [ring.middleware.json :as middleware]
            [cheshire.core :as json]))

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
                                  :sensorId id})})
  
  (route/not-found "Not Found"))

(defn app []
  (-> (routes app-routes)
      (middleware/wrap-json-body {:keywords? true})
      (middleware/wrap-json-response)))

(defn -main [& args]
  (let [port (Integer/parseInt (or (System/getenv "PORT") "8081"))]
    (jetty/run-jetty (app) {:port port})))
