var qs = require('querystring');
const { check, validationResult } = require('express-validator');
const { userInfo } = require('os');

// The main.js file of your application
module.exports = function (app) {
    /* To add data to Users db*/
    app.post("/create_user", async(req, res)=>{
        const data = request.body;
        await userInfo.add(data);
        res.send({msg: "User Added"})
    });


    /* loads home page when url is "/". There are no parameters, as the information displayed on the page is always the same: links to 
    'list devices', 'add device', 'edit device' and delete device' plus navbar with link to 'about' page */
    app.get("/", function (req, res) {
        res.render("index.html");
    });

    /* loads about page when url is "/about". There are no parameters, as the information displayed on the page is always the same: 
    navbar on top, and a description of the product and developer. */
    app.get("/about", function (req, res) {
        res.render("about.html");
    });

    /* Called when user clicks on 'add device' from home page. Renders a  page with all devices available to be added. */
    app.get("/add_device", function (req, res) {
        // query database to get all devices available to add
        let sqlquery = "SELECT * FROM available_devices GROUP BY device order by device;";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                /* if there is an error when trying to query available device types, redirect to error page displaying error message. 
                When the user clicks 'OK', redirect them to home page. */
                req.flash("error", err.message + "," + "None" + ",/,GET");
                res.redirect('/error');
            } else {
                /* if the query successfully runs, render the template 'add_device.html' passing as argument the list of devices that can be 
                added(retrieved with sqlquery). The list of possible devices to be added is displayed to the user as a series of round icons with description */
                res.render("add_device.html", {
                    deviceTypes: result
                });
            };
        });
    });

    /* Called when, from '/add_device' the user clicks on any of the available devices displayed. 
    The device selected is used as argument to build a sql query that retrieves the properties of such device. These are passed as arguments to the template 
    'add_device_form.html', which renders a custom form based on the selected device (only certain fields available) */
    app.get("/add_device/:device", function (req, res) {
        // the selected device type is detected when the user clicks on a device icon
        let chosenDevice = req.params.device;
        // a custom query retrieves available attributes for the selected device
        let sqlquery = "SELECT * FROM device_attributes WHERE device = ?;";
        
        // execute sql query
        db.query(sqlquery, chosenDevice, (err, result) => {
            if (err) {
                /* if there is an error when trying to query selected device properties, redirect to error page displaying error message. When user clicks ok,
                redirect them to '/add_device'
                */
                req.flash("error", err.message + "," + "None" + ",/add_device,GET");
                res.redirect('/error');
            } else {
                /* if there are no errors, render 'add_device_form.html' passing as arguments: the device chosen, the available device attributes, and the read_mode (=='add').
                This will display a custom form to fill to add the selected device - it displays only the properties available for the device. 
                */
                res.render("add_device_form.html", {
                    device: chosenDevice,
                    device_attributes: result,
                    read_mode: "add"
                });
            };
        });
    });

    /* After the user correctly fills in the form to add a new device and clicks submit, the new device is added to the database with the 
    properties specified by the user. If the operation is successful, the user is redirected to a page with a success message, otherwise to an error 
    page displaying the error message.  */
    app.post("/add_device/:device", function (req, res) {
        /* Prepare query - attributes and values to save dynamically. Attributes are sanitized before building query */
        let keys = [];
        let values = [];

        for (const [key, value] of Object.entries(req.body)) {
            keys.push(key);
            console.log("key: " + key + ", value: " + value);
            if (key == "device" || key == "room" || key == "name") {
                values.push("'" + value.trim() + "'");
            } else if (key == "is_on" || key == "is_open") {
                values.push(value);
                
            } else {
                values.push(escape(value.trim()));
            }
        }
        
        // query to save device and properties in database
        let sqlquery = "INSERT INTO saved_devices (" + keys.toString() + ") VALUES (" + values + ");";

        // before inserting a new device, check that there aren't already devices saved with the same name.
        let sqlqueryCheckExists = "SELECT * FROM saved_devices WHERE device = '" + req.body.device + "' and name = '" + req.body.name + "';";

        db.query(sqlqueryCheckExists, (err, result) => {
            if (result.length != 0) {
                // if a device with the chosen name already exists, alert the user and redirect them to the 'add_device' page when they acknowledge the error
                req.flash("error", "It looks like you already have a " + req.body.device + " device named '"
                    + req.body.name + "'. Please make sure each device has a unique name.,"
                    + req.body.device + ",/add_device,POST");
                return res.render("error.html", { errorMessage: req.flash('error') });
            } else {
                // if no device with the chosen name exists, proceed to execute query to add the new device and its properties.
                db.query(sqlquery, (err, result) => {
                    if (err) {
                        /* if there is a validation error when trying to insert data into the database, redirect to error page. The error page template is rendered passing as 
                        arguments the device name and type */
                        if (err.message.slice(0, 12) == "ER_DUP_ENTRY") {
                            req.flash("error", "It looks like you already have a " + req.body.device + " device named '"
                                + req.body.name + "'. Please make sure each device has a unique name.,"
                                + req.body.device + ",/add_device,POST");
                        } else {
                            req.flash("error", err.message + "," + req.body.device + ",/add_device,POST");
                        }
                        res.redirect('/error');
                    } else {
                        // if insert query runs successfully, display success message to user. The message takes as argument the device and device name and displays them in the success message.
                        req.flash("success", "Congratulations! You have successfully added a new " + req.body.device + " called " + req.body.name + " in your " +
                            req.body.room + ". You can now start using it."
                        );
                        res.redirect('/device_added');
                    }
                }); 
            }
        });
    });

    /* error page - user is redirected here whenever theere is an error. The template always receives as arguments the error message which includes, comma separated,
    the page where to redirect users when they acknowledge the error, and the action type (GET / POST). This is called when redirection is from a get request*/
    app.get("/error", function (req, res) {
        // pass error message to error page
        res.render("error.html", { errorMessage: req.flash('error') });
    });

    /* error page - user is redirected here whenever theere is an error. The template always receives as arguments the error message which includes, comma separated,
    the page where to redirect users when they acknowledge the error, and the action type (GET / POST). This is called when redirection is from a post request*/
    app.post("/error", function (req, res) {
        // pass error message to error page
        res.render("error.html", { errorMessage: req.flash('error') });
    });

    /* When a device is successfully added to the database with its properties, the user is redirected to '/device_added': a 
    page where the success message is rendered, passing as parameters to the template: the custom success message and the read mode (determines what links and titles 
        to render together with the message) */
    app.get("/device_added", function (req, res) {
        res.render("device_added.html", {
            savedDevices: req.flash('success'),
            read_mode: "add"
        });
    });

    /* When the user clicks on 'Your devices' from the home page, they are redirected to the '/device_status' url, which displays all devices saved. */
    app.get("/device_status", function (req, res) {
        // select all devices saved (for each device, pick last modification available since all modifications are kept saved)
        let sqlquery = "SELECT device, name, room, is_on, temperature, percent, program, is_open, grams, channel " +
            "from(SELECT *, MAX(update_num) OVER(PARTITION BY device, name) AS max_update FROM saved_devices) AS max_sub " +
            "WHERE max_sub.update_num = max_sub.max_update; ";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                // if there is an error, redirect to error page displaying error and when user clicks ok redirect home.
                req.flash("error", err.message + "," + "None" + ",/,GET");
                res.redirect('/error');
            } else {
                /* if query runs successfully, render 'list_devices.html' template passing as arguments: the list of device saved (query output) and 
                the read mode - used to dynamically decide what titlea and links to display. The user can from here select any of the devices saved and see
                their details. */
                res.render("list_devices.html", {
                savedDevices: result,
                readMode: "read"
                });
            }
        });
    });

    /* When the user clicks on any of the saved devices from '/device_status', the device type and name are used to retrieve the device properties saved in
    the database and a template is displayed with the saved device properties. */
    app.post("/device_status/:device/:name", function (req, res) {
        // query to retrieve the attributes available for the device selected.
        let sqlquery = "SELECT * FROM device_attributes WHERE device = '" + req.body.device + "';"
        db.query(sqlquery, (err, result) => {
            if (err) {
                // if there is an error when executing the query, redirect to error page. When user clicks 'OK, redirect them to 'device_status' page
                req.flash("error", "Device not found.," + req.body.name + ",/device_status,GET");
                res.redirect('/error');
            } else {
                /* If the query runs successfully, render the 'add_device_form.html' template passing as arguments: the read mode, which determines what title 
                and links to display, the device type, the selected device's available properties, and the selected device's saved property values. */
                res.render("add_device_form.html", {
                    device: req.body.device,
                    device_attributes: result,
                    read_mode: "read",
                    selectedDeviceProperties: req.body
                });
            }
            
        });
    });

    /* When the user clicks on 'Edit device' from the home page, they are redirected to the '/edit_device' url, which displays all devices saved. */
    app.get("/edit_device", function (req, res) {
        // select all devices saved (for each device, pick last modification available since all modifications are kept saved)
        let sqlquery = "SELECT device, name, room, is_on, temperature, percent, program, is_open, grams, channel " +
            "from(SELECT *, MAX(update_num) OVER(PARTITION BY device, name) AS max_update FROM saved_devices) AS max_sub " +
            "WHERE max_sub.update_num = max_sub.max_update; ";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                // if there is an error when executing the query, redirect to error page. When user clicks 'OK, redirect them to home page
                req.flash("error", err.message + "," + "None" + ",/,GET");
                res.redirect('/error');
            } else { 
                // if the query runs successfully, display 'list_devices.html' template, passing as arguments the list of devices saved and their properties, and the read mode.
                res.render("list_devices.html", {
                    savedDevices: result,
                    readMode: "edit"
                });
            }
        });
    });

    /* When the user, from the '/edit_device' page clicks on any device, renders a page with the relevant device attributes' current values, which can
    be modified by the user. */
    app.post("/device_status/edit/:device/:name", function (req, res) {
        // retrieve the relevant properties of the device type selected by the user (req.body.device)
        let sqlquery = "SELECT * FROM device_attributes WHERE device = '" + req.body.device + "';"
        // run the query 
        db.query(sqlquery, (err, result) => {
            if (err) {
            // if there is an error, redirect user to error page and, wehn they click 'OK', redirect them to '/device_status'
                req.flash("error", "Device not found.," + req.body.name + ",/device_status,GET");
                res.redirect('/error');
            } else {
                /* If the query runs successfully, render the '"add_device_form.html' template passing as arguments the device type, read mode (determines 
                    what links and form actions to render), the list of applicable attributes of the chosen device, and the selected device's saved properties. */
                res.render("add_device_form.html", {
                    device: req.body.device,
                    device_attributes: result,
                    read_mode: "edit",
                    selectedDeviceProperties: req.body
                });
            }

        });
    });

    /* When the user successfully edits a certain device's properties and clicks submit, a query is run, which adds the modified attributes for the given device to
    the database. If the update is successful, the user is redirected to a page displaying a success message, otherwise to an error page. */
    app.post("/update_device/:device/:name", function (req, res) {
        /* Prepare query - attributes and values to save dynamically */
        let keys = [];
        let values = [];

        for (const [key, value] of Object.entries(req.body)) {
            keys.push(key);
            console.log("key: " + key + ", value: " + value);
            if (key == "device" || key == "room" || key == "name") {
                values.push("'" + value.trim() + "'");
            } else if (key == "is_on" || key == "is_open") {
                values.push(value);
            } else {
                values.push(escape(value.trim()));
            }
        }

        // Prepare query to update device. Because we track device modifications and update_num is part of PKEY, it's insert query. 
        let insertQuery = "INSERT INTO saved_devices (" + keys.toString() + ") VALUES (" + values + ");";
 
        // saving data in database - execute sql query
        db.query(insertQuery, (err, result) => {
            if (err) {
                // if there is a validation error when trying to insert data into the database, redirect to error page. When ?OK' clicked, redirect to /add_device
                req.flash("error", err.message + "," + req.body.device + ",/add_device,POST");
                res.redirect('/error');
            } else {
                /* When the update query runs successfully, display a custom success message to the user - takes as arguments device type and device name */
                res.render("device_added.html", {
                    device: req.body.device,
                    device_attributes: result,
                    message: "Congratulations! You have successfully updated your " + req.body.device + " called " + req.body.name + ".",
                    read_mode: "update",
                    updatedDeviceProperties: req.body
                });
            }
        });
    });

    /* When the user clicks on 'Delete device' from the home page, they are redirected to the '/delete_device' url, which displays all devices saved. */
    app.get("/delete_device", function (req, res) {
        // select all devices saved (for each device, pick last modification available since all modifications are kept saved)
        let sqlquery = "SELECT device, name, room, is_on, temperature, percent, program, is_open, grams, channel " +
            "from(SELECT *, MAX(update_num) OVER(PARTITION BY device, name) AS max_update FROM saved_devices) AS max_sub " +
            "WHERE max_sub.update_num = max_sub.max_update; ";
        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                // if an error occurs, user is redirected to page displaying error. When user clicks OK, they're redireted to /delete_device
                req.flash("error", err.message + "," + req.body.device + ",/delete_device,POST");
                res.redirect('/error');
            } else {
                /* If the query runs successfully, the 'list_devices.html' template is rendered, passing as parameters a list of saved devices (output of
                    the query) and the read mode, which determines what form actions to render, what links, what titles, what sections of the template to render. */
                res.render("list_devices.html", {
                    savedDevices: result,
                    readMode: "delete"
                });
            };
        });
    });

    /* From the /delete_device page, once a user selects a device they want to delete, redirect them to a page where delte confirmation is required to continue.
    The user is asked if they really want to delete a device. If they confirm, they're redirected to /device_status/deleted/:device/:name, otherwise 
    they are redircted home.  */
    app.post("/device_status/delete/:device/:name", function (req, res) {
        // Asks user if they're sure they want to delete a device. Parameters: the device type, name, and read mode.
        res.render("device_added.html", {
            device: req.body.device,
            name: req.body.name,
            read_mode: "delete"
        });
    });

    /* When the user confirms they want to delete a device, delete the device from the database and display a success / error message to the user. */
    app.post("/device_status/deleted/:device/:name", function (req, res) {
        // query to delete selected device
        let sqlquery = "DELETE FROM saved_devices WHERE device = '" + req.body.device + "' and name = '" + req.body.name + "';";

        // execute sql query
        db.query(sqlquery, (err, result) => {
            if (err) {
                // if an error occurs, user is redirected to page displaying error. Arguments: device type, page to redirect to, redirect action
                req.flash("error", err.message + "," + req.body.device + ",/delete_device,POST");
                res.redirect('/error');
            } else {
                // if no errors occur, confirm deletion. Arguments: device type, device name, read mode (flag that determines what parts of the template to load)
                res.render("device_added.html", {
                    device: req.body.device,
                    name: req.body.name,
                    read_mode: "deleted"
                });
            };
        });
        
    });

}