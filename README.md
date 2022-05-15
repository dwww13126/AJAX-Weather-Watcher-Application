# AJAX-Weather-Watcher-Application

Project from COMPX322 Advanced Web Dev where we were tasked in creating a simple web app for allowing users to monitor weather data from a SQL database though using PHP and Javascript with AJAX. Additions and fixes will be made to improve on the assignment version.

## Setup Instructions

1. Place all files and folders (Excluding the SetupSQL folder) into your webservers htdocs folder.

2. Inside dbConnect.php, edit mysqli_connect with your database connection information.
`mysqli_connect("localhost","Username","UserPassword","DatabaseName");`

3. From the SetupSQL folder, import Users.sql onto your database to create the table used for storing Users logins.

4. From the SetupSQL folder, import Weather.sql onto your database to create the table used for storing Weather info.

5. From the SetupSQL folder, import WeatherJoin.sql onto your database to create the table used for adding town weather to a users watch list.
