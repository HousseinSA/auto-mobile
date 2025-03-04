// export async function GET(request: NextRequest) {
//   try {
//     const username = request.nextUrl.pathname.split("/").pop();
//     if (!username) {
//       return Response.json({ error: "Username required" }, { status: 400 });
//     }

//     const database = await connectDB();
//     const servicesCollection = database.collection("services");

//     const services = await servicesCollection
//       .find({
//         userName: username,
//         $or: [
//           { stockFile: { $exists: true } },
//           { modifiedFile: { $exists: true } }
//         ]
//       })
//       .toArray();

//     const files = services.flatMap(service => {
//       const files = [];
//       if (service.stockFile) {
//         files.push({
//           _id: `${service._id}-stock`,
//           fileName: service.stockFile.name,
//           fileType: 'stock',
//           uploadedAt: service.stockFile.uploadedAt,
//           ecuType: service.ecuType,
//           ecuNumber: service.ecuNumber,
//           fuelType: service.fuelType,
//           status: service.status,
//           serviceOptions: service.serviceOptions,
//           totalPrice: service.totalPrice
//         });
//       }
//       if (service.modifiedFile) {
//         files.push({
//           _id: `${service._id}-modified`,
//           fileName: service.modifiedFile.name,
//           fileType: 'modified',
//           uploadedAt: service.modifiedFile.uploadedAt,
//           ecuType: service.ecuType,
//           ecuNumber: service.ecuNumber,
//           fuelType: service.fuelType,
//           status: service.status,
//           serviceOptions: service.serviceOptions,
//           totalPrice: service.totalPrice
//         });
//       }
//       return files;
//     });

//     return Response.json({ success: true, files });
//   } catch (error) {
//     console.error("Fetch files error:", error);
//     return Response.json(
//       { error: "Failed to fetch files" },
//       { status: 500 }
//     );
//   }
// }
