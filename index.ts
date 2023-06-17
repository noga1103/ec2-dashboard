import * as express from "express";
import { Request, Response } from "express";
import { config } from "aws-sdk";
require("dotenv").config();

import { EC2 } from "@aws-sdk/client-ec2";
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

config.update({ region: "us-east-1" });

const app = express();
const port = process.env.PORT;


app.get("/instances", (req: Request, res: Response) => {
 
  if (!req.query.region || !req.query.accessKey || !req.query.secretKey) {
    res.status(500).json({ error: "missing args" });
    return;
  }


  const accessKey = req.query.accessKey as string;
  const secretKey = req.query.secretKey as string;
  const region = req.query.region as string;

  const sortAttribute = req.query.sortBy as string;
  //const pageSize = Number(req.query.pageSize) || 10;
  const page = Number(req.query.page) || 1;

  const ec2 = new EC2({
    apiVersion: "2016-11-15",
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },

    region: region,
  });

  const params = {
    DryRun: false,
  };

  ec2.describeInstances(params, function (err, data) {
    if (err) {
      console.log("Error", err.stack);
      res.status(500).json(error: "credentials error");
      return;
    } 
      const instances: any[] = [];

      if (data != undefined && data.Reservations != undefined) {
        data.Reservations.forEach((reservation: any) => {
          reservation.Instances.forEach((instance: any) => {
            const instanceInfo = {
              Name: getInstanceName(instance.Tags),
              Id: instance.InstanceId,
              Type: instance.InstanceType,
              State: instance.State.Name,
              AZ: instance.Placement.AvailabilityZone,
              PublicIP: instance.PublicIpAddress || "",
              PrivateIPs: instance.NetworkInterfaces.map(
                (iface: any) => iface.PrivateIpAddress
              ).join(", "),
            };

            instances.push(instanceInfo);
          });
        });

        //console.log("Success", JSON.stringify(instances, null, 2));

        if (sortAttribute) {
          instances.sort((a, b) => {
            if (a[sortAttribute] < b[sortAttribute]) return -1;
            if (a[sortAttribute] > b[sortAttribute]) return 1;
            return 0;
          });
        }

        const totalInstances = instances.length;
        const pageSize = Number(req.query.pageSize) || totalInstances;
        const totalPages = Math.ceil(totalInstances / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pagedInstances = instances.slice(startIndex, endIndex);

        var response = {
          totalInstances,
          totalPages,
          currentPage: page,
          instances: pagedInstances,
        };

        res.json(response);
      } else {
        res.status(500).json({ error: "No instance data available" });
      }
   
  });
});

function getInstanceName(tags: any[]): string {
  const nameTag = tags.find((tag: any) => tag.Key === "Name");
  return nameTag ? nameTag.Value : "";
}

app.listen(port, (err?: Error) => {
  if (err) throw err;
  console.log(`Listening on port ${port}`);
});
export default app;
