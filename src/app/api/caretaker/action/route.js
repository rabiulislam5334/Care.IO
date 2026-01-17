import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";

export async function POST(req) {
  const session = await getServerSession();
  if (!session) return Response.json({ message: "Unauth" }, { status: 401 });

  const { serviceId, action, rating, comment } = await req.json();
  const client = await clientPromise;
  const db = client.db("CareIO");

  if (action === "favorite") {
    // লাভ আইকন লজিক: ইমেইলটি অ্যারেতে থাকলে রিমুভ করবে, না থাকলে অ্যাড করবে
    const service = await db
      .collection("services")
      .findOne({ _id: new ObjectId(serviceId) });
    const isFav = service.favoriteBy?.includes(session.user.email);

    await db
      .collection("services")
      .updateOne(
        { _id: new ObjectId(serviceId) },
        isFav
          ? { $pull: { favoriteBy: session.user.email } }
          : { $addToSet: { favoriteBy: session.user.email } }
      );
  }

  if (action === "review") {
    // রিভিউ অ্যাড করা
    await db
      .collection("services")
      .updateOne(
        { _id: new ObjectId(serviceId) },
        {
          $push: {
            reviews: {
              user: session.user.name,
              rating,
              comment,
              date: new Date(),
            },
          },
        }
      );
  }

  return Response.json({ success: true });
}
