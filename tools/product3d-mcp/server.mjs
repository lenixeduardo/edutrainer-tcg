import {McpServer} from "@modelcontextprotocol/sdk/server/mcp.js";
import {StdioServerTransport} from "@modelcontextprotocol/sdk/server/stdio.js";
import {z} from "zod";
import {tripo, validateImageUrl, renderManifest} from "./tripo.mjs";

const server = new McpServer({name:"vira-noite-product3d",version:"0.1.0"});
const output = (value) => ({content:[{type:"text",text:JSON.stringify(value,null,2)}]});
server.tool("generate_3d_model","Create a private draft Tripo Image-to-3D task",{
  imageUrl:z.string().url(), model:z.string().default("v3.1-20260211"),
  confirmPaidGeneration:z.boolean().default(false)
},async ({imageUrl,model,confirmPaidGeneration}) => {
  validateImageUrl(imageUrl);
  if (!confirmPaidGeneration) return output({status:"awaiting_confirmation",note:"This task may consume Tripo credits"});
  const data = await tripo("/generation/image-to-model",{method:"POST",body:JSON.stringify({input:imageUrl,model,texture:true,pbr:true})});
  return output({status:"submitted",taskId:data.task_id,published:false});
});
server.tool("get_3d_task","Read Tripo task status",{
  taskId:z.string().uuid()
},async ({taskId}) => output(await tripo("/tasks/"+taskId)));
server.tool("validate_product","Create a manual fidelity-review checklist",{
  productId:z.string(), modelUrl:z.string().url()
},async ({productId,modelUrl}) => {
  validateImageUrl(modelUrl);
  return output({productId,status:"requires_manual_review",checks:["cylindrical geometry","curved mouthpiece","second top opening","internal tubes","honeycomb base","original Barbie print","pink trim","transparent body"],approved:false});
});
server.tool("render_product","Prepare four commercial 3:4 camera angles; rendering requires a renderer worker",{
  productId:z.string(),modelUrl:z.string().url(),background:z.string().default("#ed65a3")
},async (args) => output({status:"manifest_only",...renderManifest(args)}));
server.tool("publish_product","Production publication is disabled in this prototype",{
  productId:z.string()
},async ({productId}) => output({productId,published:false,status:"blocked",reason:"Prototype cannot publish to production"}));
await server.connect(new StdioServerTransport());
