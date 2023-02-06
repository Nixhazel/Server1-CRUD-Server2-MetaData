import http, { IncomingMessage, Server, ServerResponse } from "http";
import fs from "fs";
/*
implement your server code here
*/

const server: Server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
// GET REQUEST "READ"
  if (req.method === "GET") {
    fs.readFile("/Users/decagon/Desktop/WEEK 5/week-5-task-Nixhazel/server/database.json", "utf-8", (err, chunk) => {
        return res.end((chunk));
        })
  }
  
  //POST REQUEST "CREATE"

  if (req.method === "POST") {
    let newdata: string;
    req.on("data", (data) => {
      newdata = data.toString("utf8");
    })
    req.on("end", () => {
      let  newdataobj = JSON.parse(newdata)
      let file  = fs.readFileSync("/Users/decagon/Desktop/WEEK 5/week-5-task-Nixhazel/server/database.json", "utf-8");
      let fileob = JSON.parse(file);
      // fileob.push(newdataobj);
      fileob.push({ ...newdataobj, "createdAt": new Date(), "updatedAt": new Date(), "id": !fileob.length ? 1 :  fileob.length +1 })
      
      fs.writeFileSync("/Users/decagon/Desktop/WEEK 5/week-5-task-Nixhazel/server/database.json", JSON.stringify(fileob, null, 2));

      return res.end(JSON.stringify(fileob));
    })
    
  }

  // PUT REQUEST "UPDATE"


  if (req.method === "PUT") {
    
    let urlid = Number(req.url?.replace("/",""));
  
      let chunkupdate: string;
      req.on("data", (data) => {
      chunkupdate = data.toString("utf8");
      })
      req.on("end", () => {
      let  chunkupdateobj = JSON.parse(chunkupdate)
      let filedb  = fs.readFileSync("/Users/decagon/Desktop/WEEK 5/week-5-task-Nixhazel/server/database.json", "utf-8");
        let filedbob = JSON.parse(filedb);
        let id: number = urlid;

        filedbob.forEach((element: object, index: number) => {
          if (element.id === id) {
            filedbob[index] = { ...chunkupdateobj, "createdAt": filedbob[index].createdAt, "updatedAt": new Date(), "id": urlid }
            console.log(filedbob[index]);
          }
        });
        
        
        fs.writeFileSync("/Users/decagon/Desktop/WEEK 5/week-5-task-Nixhazel/server/database.json", JSON.stringify(filedbob, null, 2));

      return res.end("updated: ");
    })
  }

// DELETE
  if (req.method === "DELETE") {
      let urlid = Number(req.url?.replace("/",""));
      let chunkdelete: string;
      req.on("data", (data) => {
      chunkdelete = data.toString("utf8");
      })
      req.on("end", () => {
      
      let filedb  = fs.readFileSync("/Users/decagon/Desktop/WEEK 5/week-5-task-Nixhazel/server/database.json", "utf-8");
        let filedbobj = JSON.parse(filedb);
        let id: number = urlid;

        filedbobj.forEach((element: any, index: number) => {
          if (element.id === id) {
            
            filedbobj.splice(index, 1);
          }
        });
        
        fs.writeFileSync("/Users/decagon/Desktop/WEEK 5/week-5-task-Nixhazel/server/database.json", JSON.stringify(filedbobj, null, 2));

      return res.end("deleted: ");
    })
  }
  

  }
);

server.listen(3005, () => {
  console.log("server started on port 3005");
});
