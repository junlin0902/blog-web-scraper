import type { EditBlogContentById, UpdateBlogContentInput } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
} from '@redwoodjs/forms'

type FormBlogContent = NonNullable<EditBlogContentById['blogContent']>

interface BlogContentFormProps {
  blogContent?: EditBlogContentById['blogContent']
  onSave: (data: UpdateBlogContentInput, id?: FormBlogContent['id']) => void
  error: RWGqlError
  loading: boolean
}

const BlogContentForm = (props: BlogContentFormProps) => {
  const onSubmit = (data: FormBlogContent) => {
    props.onSave(data, props?.blogContent?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormBlogContent> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="head"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Head
        </Label>

        <TextField
          name="head"
          defaultValue={props.blogContent?.head}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="head" className="rw-field-error" />

        <Label
          name="content"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Content
        </Label>

        <TextField
          name="content"
          defaultValue={props.blogContent?.content}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="content" className="rw-field-error" />

        <Label
          name="link"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Link
        </Label>

        <TextField
          name="link"
          defaultValue={props.blogContent?.link}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="link" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default BlogContentForm
