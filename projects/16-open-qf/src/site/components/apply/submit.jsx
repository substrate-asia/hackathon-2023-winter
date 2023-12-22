import { useSelector } from "react-redux";
import { Button } from "../button";
import Card from "../card";
import { applyFormValueSelector } from "@/store/reducers/applySlice";
import { isArray, some } from "lodash-es";
import { SystemCheckbox, SystemCheckboxActive } from "@osn/icons/opensquare";
import { useState } from "react";

const agreements = [
  "I understand that the newly submitted project will be 'unlisted' until reviewed by OpenSquare team.",
  "I understand that once the donation address is published, it can not be changed, so please ensure that you have entered the correct address.",
];

export default function ApplyProjectSubmitSidebar() {
  const [agreementValues, setAgreementValues] = useState([false, false]);
  const formValue = useSelector(applyFormValueSelector);
  const disabled = some(
    [...Object.values(formValue), ...agreementValues],
    (v) => {
      if (isArray(v)) {
        return v.filter(Boolean).length === 0;
      }

      return !v;
    },
  );

  return (
    <Card>
      <div className="space-y-5">
        {agreements.map((agreement, idx) => (
          <div
            key={idx}
            className="flex space-x-2 text-text-primary text14medium"
          >
            <div
              role="button"
              onClick={() => {
                setAgreementValues((prev) => {
                  const next = [...prev];
                  next[idx] = !next[idx];

                  return next;
                });
              }}
            >
              {agreementValues[idx] ? (
                <SystemCheckbox className="w-5 h-5" />
              ) : (
                <SystemCheckboxActive className="w-5 h-5" />
              )}
            </div>
            <div className="">{agreement}</div>
          </div>
        ))}

        <Button
          disabled={disabled}
          className="w-full"
          onClick={() => {
            // eslint-disable-next-line
            console.log(formValue);
          }}
        >
          Submit
        </Button>
      </div>
    </Card>
  );
}
