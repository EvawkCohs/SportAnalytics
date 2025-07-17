# 📊 SportAnalytics
**SportAnalytics** ist eine Webanwendung zur Analyse und Visualisierung sportlicher Leistungsdaten im Handball.  
Die Daten stammen von [handball.net](https://www.handball.net) und werden über eine Kombination aus **API-Calls** und **Webscraping** automatisiert erfasst.  
Beim Aufruf der Spielplan-Seite werden die Spieldaten automatisch in einer MongoDB-Datenbank zwischengespeichert, um eine stabile Darstellung auch bei Ausfällen oder Nichterreichbarkeit von *handball.net* zu gewährleisten.

🌍 **Live-Demo**: [sportanalytics-frontend.onrender.com](http://sportanalytics-frontend.onrender.com/)

---

## 🚀 Features

- 📈 Darstellung von Leistungsdaten in dynamischen Charts
- 🔍 Filterung nach Spielern, Zeiträumen und Metriken
- ⚙️ Integration mit einem Backend (API)
- 📱 Responsive Design – nutzbar auf Desktop & Mobile
- 💾 Speichern von benutzerdefinierten Daten, um erfasste Daten zu ergänzen
- 🎥 Videoplayer zur Videonalyse und Datenerhebung

---

## 🖥️ Tech Stack

- React
- Nivo Charts
- Material UI
- Axios (für API-Calls)
- MongoDB
- Express
- Nodejs
- Deployment über Render.com

## 🗃️ Datenquelle

Die in dieser Anwendung verwendeten Spieldaten und Statistiken stammen von [handball.net](https://www.handball.net).

- 🔗 Öffentliche API: Für strukturierte Datenabrufe (z. B. Spielergebnisse, Teams)
- 🕸️ Webscraping: Für Inhalte ohne API-Zugriff (z. B. Spielerprofile, Statistiken)

Beim Aufruf der Spielplan-Seite werden die Spieldaten automatisch in einer MongoDB-Datenbank geispeichert, um eine stabile Darstellung auch bei Ausfällen oder Nichterreichbarkeit von handball.net zu gewährleisten.
