import react from "react";
import Nav from "./components/navBar";
import SearchBar from "./components/searchBar";
import UploadButton from "./components/uploadButton";
import TabBar from "./components/tabBar";

export default function DashboardPage() {
  return (
    <>
      <Nav />
      <SearchBar />
      <TabBar />
    </>
  );
}
