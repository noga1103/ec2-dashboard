// I'm using here access key and secert access key that were genrated for tests. 
function testURL(url, expectedOutput, testNum) {
 
  fetch(url)
    .then(function(response) {
      
      return response.json();
    })
    .then(function(output) {
     
      var expectedString = JSON.stringify(expectedOutput);
      var actualString = JSON.stringify(output);

      if (expectedString === actualString) {
        console.log("Test",testNum, "passed!");
      
      } else {
        console.log("Test", testNum, "failed!");
        console.log("Expected:", expectedString);
        console.log("Actual:", actualString);
      }
    })
    .catch(function(error) {
      console.log("Error:", error);
     });
}

// error when not all arguments are recieved
testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW",
{"error":"An error occurred"},
1);

testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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",
{"error":"An error occurred"},
2);

testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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",
{"error":"An error occurred"},
3);

// all permeters recieved, page size is 4
testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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&region=us-east-1&sortBy=Id&page=1&pageSize=4", 
{"totalInstances":4,"totalPages":1,"currentPage":1,"instances":[{"Name":"test1","Id":"i-04e62ddd5808f3991","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.234.204.64","PrivateIPs":"172.31.85.112"},{"Name":"homeAssignmentCisco","Id":"i-07eb816712abd3216","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"18.206.61.192","PrivateIPs":"172.31.95.131"},{"Name":"myFirstInstance","Id":"i-099e6f83ea7352423","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"44.211.226.107","PrivateIPs":"172.31.86.137"},{"Name":"trial","Id":"i-0fd779ad6fd25f540","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.211.68.65","PrivateIPs":"172.31.86.102"}]},
4
);


// all permeters recieved, page size is 3, one page is not displayed
testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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&region=us-east-1&sortBy=Id&page=1&pageSize=3", 
{"totalInstances":4,"totalPages":2,"currentPage":1,"instances":[{"Name":"test1","Id":"i-04e62ddd5808f3991","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.234.204.64","PrivateIPs":"172.31.85.112"},{"Name":"homeAssignmentCisco","Id":"i-07eb816712abd3216","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"18.206.61.192","PrivateIPs":"172.31.95.131"},{"Name":"myFirstInstance","Id":"i-099e6f83ea7352423","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"44.211.226.107","PrivateIPs":"172.31.86.137"}]},
5
);


//same as previous, page 2
testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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&region=us-east-1&sortBy=Id&page=2&pageSize=3", 
{"totalInstances":4,"totalPages":2,"currentPage":2,"instances":[{"Name":"trial","Id":"i-0fd779ad6fd25f540","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.211.68.65","PrivateIPs":"172.31.86.102"}]},
6
);

//same as previous, page 3
testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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&region=us-east-1&sortBy=Id&page=3&pageSize=3", 
{"totalInstances":4,"totalPages":2,"currentPage":3,"instances":[]},
7
);

//no sort

testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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&region=us-east-1&page=1&pageSize=3", 
{"totalInstances":4,"totalPages":2,"currentPage":1,"instances":[{"Name":"homeAssignmentCisco","Id":"i-07eb816712abd3216","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"18.206.61.192","PrivateIPs":"172.31.95.131"},{"Name":"test1","Id":"i-04e62ddd5808f3991","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.234.204.64","PrivateIPs":"172.31.85.112"},{"Name":"myFirstInstance","Id":"i-099e6f83ea7352423","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"44.211.226.107","PrivateIPs":"172.31.86.137"}]},
8
);

//no paging, sort by type
testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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&region=us-east-1&sortBy=Type",
{"totalInstances":4,"totalPages":1,"currentPage":1,"instances":[{"Name":"homeAssignmentCisco","Id":"i-07eb816712abd3216","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"18.206.61.192","PrivateIPs":"172.31.95.131"},{"Name":"test1","Id":"i-04e62ddd5808f3991","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.234.204.64","PrivateIPs":"172.31.85.112"},{"Name":"myFirstInstance","Id":"i-099e6f83ea7352423","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"44.211.226.107","PrivateIPs":"172.31.86.137"},{"Name":"trial","Id":"i-0fd779ad6fd25f540","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.211.68.65","PrivateIPs":"172.31.86.102"}]},
9)

//no paging, sort by Name
testURL("https://ec2dashboard-z89h.onrender.com/instances/?accessKey=AKIAZ5VVGJ5AUKG65VFW&secretKey=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&region=us-east-1&sortBy=Name", 
{"totalInstances":4,"totalPages":1,"currentPage":1,"instances":[{"Name":"homeAssignmentCisco","Id":"i-07eb816712abd3216","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"18.206.61.192","PrivateIPs":"172.31.95.131"},{"Name":"myFirstInstance","Id":"i-099e6f83ea7352423","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"44.211.226.107","PrivateIPs":"172.31.86.137"},{"Name":"test1","Id":"i-04e62ddd5808f3991","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.234.204.64","PrivateIPs":"172.31.85.112"},{"Name":"trial","Id":"i-0fd779ad6fd25f540","Type":"t2.micro","State":"running","AZ":"us-east-1a","PublicIP":"54.211.68.65","PrivateIPs":"172.31.86.102"}]},
10
);
