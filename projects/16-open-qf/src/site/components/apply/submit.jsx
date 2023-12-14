import { useSelector } from "react-redux";
import { Button } from "../button";
import Card from "../card";
import { applyFormValueSelector } from "@/store/reducers/applySlice";
import { isArray, some } from "lodash-es";

export default function ApplyProjectSubmitSidebar() {
  const formValue = useSelector(applyFormValueSelector);
  const disabled = some(Object.values(formValue), (v) => {
    if (isArray(v)) {
      return v.filter(Boolean).length === 0;
    }

    return !v;
  });

  return (
    <Card>
      <Button
        disabled={disabled}
        onClick={() => {
          // eslint-disable-next-line
          console.log(formValue);
        }}
      >
        Submit
      </Button>
    </Card>
  );
}
