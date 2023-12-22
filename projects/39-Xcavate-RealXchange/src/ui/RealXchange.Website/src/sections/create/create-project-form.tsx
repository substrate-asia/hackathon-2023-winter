'use client';

import { SectionHeader, SectionTitle } from '@/components/section-header';
import { Button } from '@/components/ui/button';
import FileInput from '@/components/ui/file-input';
import Form, { useZodForm } from '@/components/ui/form';
import Input from '@/components/ui/input';
import SelectInput from '@/components/ui/select';
import Textarea from '@/components/ui/text-area';
import { usePageContext } from '@/context/page-contex';
import { createProjectSchema } from '@/lib/zod';
import { Fragment } from 'react';
import { number, object, string } from 'zod';

const categories = [
  {
    name: 'Housing',
    value: 'housing'
  },
  {
    name: 'Environment',
    value: 'environment'
  },
  {
    name: 'Ecology',
    value: 'ecology'
  },
  {
    name: 'Social',
    value: 'social'
  }
];
const lengths = [
  {
    name: '3 Month',
    value: 3
  },
  {
    name: '4 Month',
    value: 4
  },
  {
    name: '6 Month',
    value: 6
  },
  {
    name: '9 Month',
    value: 9
  }
];

export function CreateProjectForm() {
  const context = usePageContext();

  const onCreateProject = (data: {
    length: string;
    name: string;
    category: string;
    location: string;
    description: string;
    target: string;
  }) => {
    // console.log(data);
    context?.setPageValues({ page: 'add-nft', project: data });
  };

  const form = useZodForm({
    schema: createProjectSchema
  });

  return (
    <Fragment>
      {context?.page === 'create-project' ? (
        <section className="flex flex-col gap-6 border-l border-foreground py-[90px] pl-[84px]">
          <SectionHeader>
            <SectionTitle size={'lg'}>Create project</SectionTitle>
            <div className="flex items-center space-x-2">
              <dt className="text-[0.75rem] font-light text-[0.6]"> Created by:</dt>
              <dd className="text-[1rem]/[1.5rem]">@Trillion_Treesfoundation</dd>
            </div>
          </SectionHeader>
          <Form form={form} onSubmit={form.handleSubmit(onCreateProject)}>
            <Input
              label="Project name"
              htmlFor="name"
              type="text"
              placeholder="e.g(text)"
              {...form.register('name')}
            />
            <SelectInput
              label="Project category"
              htmlFor="category"
              options={categories}
              {...form.register('category')}
            />
            <Input
              label="Project location"
              htmlFor="name"
              type="text"
              placeholder="London"
              {...form.register('location', { required: true })}
            />
            <Textarea
              label="Project description"
              htmlFor="description"
              placeholder="Text"
              rows={3}
              {...form.register('description')}
            />

            <FileInput />

            <Input
              label="Funding target"
              htmlFor="name"
              type="text"
              placeholder="$0.00"
              {...form.register('target', { required: true })}
            />

            <SelectInput
              label="Project length"
              htmlFor="length"
              options={lengths}
              {...form.register('length')}
            />

            <Button
              type="submit"
              variant={'primary'}
              className="my-5 w-full"
              disabled={form.formState.isSubmitting}
            >
              Continue
            </Button>
          </Form>
        </section>
      ) : null}
    </Fragment>
  );
}
