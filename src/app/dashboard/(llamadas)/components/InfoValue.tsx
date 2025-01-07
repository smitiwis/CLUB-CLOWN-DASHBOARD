import React, { FC } from "react";

type Props = {
  label: string;
  value: string | React.ReactNode;
};
const InfoValue: FC<Props> = ({ label, value }) => {
  if (!value || !label) return null;
  return (
    <>
      <h4 className="text-small font-semibold  text-default-600">{label}</h4>
      <h5 className="text-small tracking-tight text-default-500">
        {value}
      </h5>
    </>
  );
};

export default InfoValue;
