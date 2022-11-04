// import { Message } from "discord.js";
// import get from "axios";

// module.exports = {
//   event: "messageCreate",
//   async execute(client: any, paguClient: any, message: Message) {
//     const re = /(?:(?:https?|ftp):\/\/)?[\w/\-?=%.]+\.[\w/\-&?=%.]+/;
//     let link = message.content?.match(re)?.[0];
//     if (link === undefined) {
//       return;
//     }
//     link =
//       link.includes("https://") || link.includes("http://")
//         ? link
//         : "http://" + link;
//     try {
//       get({
//         url: link,
//         maxRedirects: 0,
//       }).catch(async (e) => {
//         if (e.response.status >= 300 && e.response.status < 400) {
//           await message.delete();
//           const sentMessage = await message.channel.send(
//             "You can not use a URL shortener."
//           );
//           setTimeout(() => {
//             sentMessage.delete();
//           }, 15000);
//         }
//       });
//     } catch (e: any) {
//       if (e.response.status >= 300 && e.response.status < 400) {
//         await message.delete();
//         await message.channel.send("You can not use a URL shortener.");
//       }
//     }
//   },
// };
