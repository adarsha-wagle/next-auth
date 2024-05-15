import { connectDB } from "@/dbConfig/dbConfig";
import { getDataFromToken } from "@/helpers/getDataFromToken";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connectDB();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);

    const user = await User.findOne({ _id: userId }).select(
      "-password -username"
    );

    return NextResponse.json({ message: "User Found", data: user });
    // Check if there is no user
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
