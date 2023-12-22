'use client';

import { SectionHeader, SectionTitle } from '@/components/section-header';
import { Disclosure } from '@/components/ui/Disclosure';
import { BaseButton } from '@/components/ui/base-button';
import { Button } from '@/components/ui/button';
import Form, { useZodForm } from '@/components/ui/form';
import Input from '@/components/ui/input';
import { usePageContext } from '@/context/page-contex';
import { addNFTSchema } from '@/lib/zod';
import { Fragment, useCallback, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { PreviewArtLarge } from './preview-art-large';
import { z } from 'zod';

export function CreateNftForm() {
  const context = usePageContext();
  const [isOpen, setIsOpen] = useState(false);

  console.log(context?.project); // get project info from context

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const form = useZodForm({
    schema: addNFTSchema,
    defaultValues: {
      nfts: [{ keyword: '', color: '', description: '', supply: '', price: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'nfts'
  });

  const handleRemoveVariant = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove]
  );

  const handleAddVariant = useCallback(() => {
    append({ keyword: '', color: '', description: '', supply: '', price: '' });
  }, [append]);

  const onSubmit = (data: z.infer<typeof addNFTSchema>) => {
    console.log(data);
  };

  return (
    <Fragment>
      {context?.page === 'add-nft' ? (
        <section className="flex  flex-col gap-6 border-l border-foreground py-[90px] pl-[84px]">
          <SectionHeader>
            <SectionTitle size={'lg'}>Create NFTs</SectionTitle>
            <div className="flex items-center space-x-2">
              <dt className="text-[0.75rem] font-light text-[0.6]"> Created by:</dt>
              <dd className="text-[1rem]/[1.5rem]">@Trillion_Treesfoundation</dd>
            </div>
          </SectionHeader>
          <Form form={form} onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <Disclosure
                key={field.id}
                title={`Variant ${index}`}
                collapseOpen={index === 0}
              >
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Keywords"
                    htmlFor="keywords"
                    type="text"
                    placeholder="e.g(text)"
                    {...form.register(`nfts.${index}.keyword`)}
                  />
                  <Input
                    label="Color"
                    htmlFor="color"
                    type="text"
                    placeholder="e.g(text)"
                    {...form.register(`nfts.${index}.color`)}
                  />
                </div>
                <Input
                  label="Descriptiom"
                  htmlFor="description"
                  type="text"
                  placeholder="e.g(text)"
                  {...form.register(`nfts.${index}.description`)}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Supply"
                    htmlFor="supply"
                    type="text"
                    placeholder="E.g 100"
                    {...form.register(`nfts.${index}.supply`)}
                  />
                  <Input
                    label="Price per NFTs"
                    htmlFor="price"
                    type="text"
                    placeholder="E.g $2,000"
                    {...form.register(`nfts.${index}.price`)}
                  />
                </div>
                <BaseButton
                  onClick={() => handleRemoveVariant(index)}
                  className="flex justify-end text-[1rem]/[1.5rem] text-accent-error"
                >
                  Remove variant
                </BaseButton>
              </Disclosure>
            ))}
            <BaseButton
              onClick={handleAddVariant}
              className="text-[1rem]/[1.5rem] text-accent"
            >
              Add variants
            </BaseButton>

            <Button
              type="submit"
              className="my-5 w-full"
              // disabled={form.formState.isSubmitting}
              // onClick={openModal}  // show preview modal
            >
              Preview artwork
            </Button>
          </Form>
        </section>
      ) : null}
      <PreviewArtLarge open={isOpen} close={closeModal} />
    </Fragment>
  );
}
