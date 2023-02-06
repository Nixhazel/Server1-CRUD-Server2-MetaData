import http, { IncomingMessage, Server, ServerResponse } from "http";
import axios from "axios";
import cheerio from "cheerio";
/*
implement your server code here
*/
interface server2ond {
  title : string,
  description : string|undefined,
  imageurl : (string|undefined)[]
}

const server: Server = http.createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    if (req.method === "POST") {

      req.on("data", (data: string) => {
        const newData = JSON.parse(data);
        const scrapData = async () => {
          
          try {
            const imgurlarr = [];
            const url = await axios.get(newData.url);
            const $ = cheerio.load(url.data);
            const title: string = $("title").text();
            const description: string|undefined = $(('meta[name="description"]')).attr('content');
            const images = $("img");

            for (let i = 0; i < images.length; i++){
              imgurlarr.push($(images[i]).attr("src"));
            }
            const answer: server2ond = {
              title: title,
              description: description,
              imageurl: imgurlarr
            };
            
            return res.end(JSON.stringify(answer));
          
          } catch (err) {
            console.log(err);
          }
        }
        scrapData();
      });
      
      }
    }
);

server.listen(3001, () => {
  console.log("Server stated on port 3001");
});
