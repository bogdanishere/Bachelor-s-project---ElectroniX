import Table from "./Table";

function InformationRow({ listTheData, Body }) {
  return (
    <Table.Row>
      <div></div>
      <Body listTheData={listTheData}></Body>
    </Table.Row>
  );
}

export default InformationRow;
