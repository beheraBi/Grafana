<p>
  <img src="https://github.com/grafana/grafana/blob/master/docs/logo-horizontal.png" alt="grafana" />
</p>
The open-source platform for monitoring and observability.
<br><br>

Grafana allows you to query, visualize, alert on and understand your metrics no matter where they are stored. Create, explore, and share dashboards with your team and foster a data driven culture:

- **Visualize:** Fast and flexible client side graphs with a multitude of options. Panel plugins for many different way to visualize metrics and logs.
- **Dynamic Dashboards:** Create dynamic & reusable dashboards with template variables that appear as dropdowns at the top of the dashboard.
- **Explore Metrics:** Explore your data through ad-hoc queries and dynamic drilldown. Split view and compare different time ranges, queries and data sources side by side.
- **Explore Logs:** Experience the magic of switching from metrics to logs with preserved label filters. Quickly search through all your logs or streaming them live.
- **Alerting:** Visually define alert rules for your most important metrics. Grafana will continuously evaluate and send notifications to systems like Slack, PagerDuty, VictorOps, OpsGenie.
- **Mixed Data Sources:** Mix different data sources in the same graph! You can specify a data source on a per-query basis. This works for even custom datasources.

## Basic Requirements of Grafana:

### Supported Operating Systems:
1. Debian / Ubuntu
2. RPM-based Linux
3. macOS
4. Windows

### Hardware Recommendations:
1. Grafana is very lightweight in use of memory and CPU and doesn't use a lot of resources.
2. Minimum recommended memory: 255 MB
   Minimum recommended CPU: 1
   
### Supported Databases
Grafana requires a database to store its configuration data, such as users, data sources, and dashboards. The exact requirements depend on the size of the Grafana installation and features used.

Grafana supports the following databases
- SQLite
- MYSQL
- PostgreSQL

**Note:** By default, Grafana installs with and uses SQLite, which is an embedded database stored in the Grafana installation location.

### Supported Web Browsers:
- Çhrome
- Firefox
- Safari
- Microsoft Edge
- IE 11 (only fully supported prior v6.0)

## Installing Grafana

- [Install Grafana](https://grafana.com/docs/grafana/latest/installation/)
- [Install Grafana on Windows](https://grafana.com/docs/grafana/latest/installation/windows/)

After Grafana installation, you can access the web server at http://localhost:3000/.

Following are the default credentials required to login:

**username:**	admin<br>
**password:** admin	

**Note**: When you log in for the first time, Grafana asks you to change your password.

## Documentation
- [Grafana documentation](https://grafana.com/docs/grafana/latest/)
- [Watch Grafana in action](https://play.grafana.org/d/000000012/grafana-play-home?orgId=1)

## Training Materials

* https://www.youtube.com/watch?v=4qpI4T6_bUw
* https://grafana.com/tutorials/  


