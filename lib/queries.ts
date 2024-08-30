import { bible_book, bible_verse } from "@/db/schema";
import { executeQuery } from "@/utils/executeQuery";
import { db } from "@/db";


export async function getVerses() {
	return executeQuery({
		queryFn: async () =>
			db
				.select()
				.from(bible_verse),

		serverErrorMessage: "getVerses",
		isProtected: false,
	});
}

export async function getBooks() {
	return executeQuery({
		queryFn: async () =>
			db
				.select()
				.from(bible_book),

		serverErrorMessage: "getBooks",
		isProtected: false,
	});
}