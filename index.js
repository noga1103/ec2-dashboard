"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var aws_sdk_1 = require("aws-sdk");
require("dotenv").config();
var client_ec2_1 = require("@aws-sdk/client-ec2");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;
aws_sdk_1.config.update({ region: "us-east-1" });
var app = express();
var port = process.env.PORT;
app.get("/instances", function (req, res) {
    if (!req.query.region || !req.query.accessKey || !req.query.secretKey) {
        res.status(500).json({ error: "An error occurred" });
        return;
    }
    var accessKey = req.query.accessKey;
    var secretKey = req.query.secretKey;
    var region = req.query.region;
    var sortAttribute = req.query.sortBy;
    if (req.query.page && (!Number(req.query.page) || Number(req.query.page) <= 0)) {
        res.status(400).json({ error: "Invalid page parameter. Must be a positive integer." });
        return;
    }
    if (req.query.pageSize && (!Number(req.query.pageSize) || Number(req.query.pageSize) <= 0)) {
        res.status(400).json({ error: "Invalid pageSize parameter. Must be a positive integer." });
        return;
    }
    var array = ["Name", "Id", "Type", "State", "AZ", "PublicIP", "PrivateIPs"];
    if (sortAttribute && !array.includes(sortAttribute)) {
        res.status(400).json({ error: "Invalid sortBy parameter. Must be one of 'Name', 'Id', 'Type', 'State', 'AZ', 'PublicIP', 'PrivateIPs'." });
        return;
    }
    var page = Number(req.query.page) || 1;
    var ec2 = new client_ec2_1.EC2({
        apiVersion: "2016-11-15",
        credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
        },
        region: region,
    });
    var params = {
        DryRun: false,
    };
    ec2.describeInstances(params, function (err, data) {
        if (err) {
            console.log("Error", err.stack);
            res.status(500).json({ error: "credentials error" });
            return;
        }
        var instances = [];
        if (data != undefined && data.Reservations != undefined) {
            data.Reservations.forEach(function (reservation) {
                reservation.Instances.forEach(function (instance) {
                    var instanceInfo = {
                        Name: getInstanceName(instance.Tags),
                        Id: instance.InstanceId,
                        Type: instance.InstanceType,
                        State: instance.State.Name,
                        AZ: instance.Placement.AvailabilityZone,
                        PublicIP: instance.PublicIpAddress || "",
                        PrivateIPs: instance.NetworkInterfaces.map(function (iface) { return iface.PrivateIpAddress; }).join(", "),
                    };
                    instances.push(instanceInfo);
                });
            });
            //console.log("Success", JSON.stringify(instances, null, 2));
            if (sortAttribute) {
                instances.sort(function (a, b) {
                    if (a[sortAttribute] < b[sortAttribute])
                        return -1;
                    if (a[sortAttribute] > b[sortAttribute])
                        return 1;
                    return 0;
                });
            }
            var totalInstances = instances.length;
            var pageSize = Number(req.query.pageSize) || totalInstances;
            var totalPages = Math.ceil(totalInstances / pageSize);
            var startIndex = (page - 1) * pageSize;
            var endIndex = startIndex + pageSize;
            var pagedInstances = instances.slice(startIndex, endIndex);
            var response = {
                totalInstances: totalInstances,
                totalPages: totalPages,
                currentPage: page,
                instances: pagedInstances,
            };
            res.json(response);
        }
        else {
            res.status(500).json({ error: "No instance data available" });
        }
    });
});
function getInstanceName(tags) {
    var nameTag = tags.find(function (tag) { return tag.Key === "Name"; });
    return nameTag ? nameTag.Value : "";
}
app.listen(port, function (err) {
    if (err)
        throw err;
    console.log("Listening on port ".concat(port));
});
exports.default = app;
