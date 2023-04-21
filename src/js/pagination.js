import getGallery from "./getGallery";
import tredingGallery from "./renderGallery";
import Pagination from "tui-pagination";
import "tui-pagination/dist/tui-pagination.css";

const paginationDOM = document.querySelector("#pagination");

const setPagination = async (event) => {
	page = 1;
	try {
		const data = await getGallery.getTrendingGallery(page);
		console.log(data);
		const options = {
			totalItems: data.total_results,
			itemsPerPage: 20,
			visiblePages: 5,
			page: 1,
			centerAlign: true,
		};
		console.log(options);
		const pagination = new Pagination(paginationDOM, options);

		pagination.on("beforeMove", async (event) => {
			const newPageData = await getGallery.getTrendingGallery(event.page);
			tredingGallery.renderTrendingGallery(newPageData.results);
		});
	} catch (error) {
		console.log(error);
	}
};
export default setPagination;
