import React from "react";
import { usePersonal } from "./PersonalRender";
import Table from "./Table";
import { StyledEmployee, Title } from "./UIElements";
import InformationRow from "./InformationRow";

function PersonalUI() {
  const { data, name, columns, Header, Body } = usePersonal();

  return (
    <StyledEmployee>
      <Title>Bine ati revenit, {name}</Title>

      <Table columns={`0.6fr ${columns}`}>
        <Table.Header>
          <div />
          <Header />
          <div />
        </Table.Header>

        <Table.Body
          data={data}
          render={(item, index) => (
            <InformationRow listTheData={item} key={index} Body={Body} />
          )}
        />
      </Table>
    </StyledEmployee>
  );
}

export default PersonalUI;
