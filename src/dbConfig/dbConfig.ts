import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const connection = mongoose.connection;

    // Listen to events on connection just to prevent error when db crashes or something happens like connectivity

    connection.on("connected", () => {
      console.log("Mongodb connected");
    });

    connection.on("error", (err) => {
      console.log(
        "Mongodb connection error, please make sure db is up and running",
        err
      );
      process.exit();
    });
  } catch (err) {
    console.log("Something went wrong in connecting to DB", err);
  }
}
