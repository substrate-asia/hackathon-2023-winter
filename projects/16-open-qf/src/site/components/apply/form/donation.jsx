import Card from "@/components/card";
import FormItem from "@/components/form/item";
import {
  applyFormValueSelector,
  updateApplyFormValue,
} from "@/store/reducers/applySlice";
import { Input, ChainIcon } from "@osn/common-ui";
import { useDispatch, useSelector } from "react-redux";

export default function ApplyProjectDonationForm({}) {
  const dispatch = useDispatch();
  const formValue = useSelector(applyFormValueSelector);

  return (
    <Card>
      <FormItem
        label="Donation Address"
        description="Please enter the Polkadot mainnet address for receiving funds"
        htmlFor="donation"
      >
        <Input
          id="donation"
          suffix={<ChainIcon chainName="polkadot" />}
          value={formValue.donation}
          onChange={(e) => {
            dispatch(updateApplyFormValue({ donation: e.target.value }));
          }}
        />
      </FormItem>
    </Card>
  );
}
