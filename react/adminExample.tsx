import React, { FC, useState } from 'react'
import {
  Layout,
  PageBlock,
  Table,
  ModalDialog,
  Input,
  Dropdown,
} from 'vtex.styleguide'
import { useMutation, useQuery } from 'react-apollo'

import getFacturation from './graphql/getFacturation.gql'
import createFacturacion from './graphql/createFacturacion.gql'

const AdminExample: FC = () => {
  const [isOpen, setOpen] = useState(false)
  const [usoCFDISel, setUsoCFDI] = useState('')
  const [rfc, setRFC] = useState('')
  const [organizacion, setOrg] = useState('')
  const [email, setEmail] = useState('')

  const [mutateFunction, {}] = useMutation(createFacturacion)

  const { data, loading, error } = useQuery(getFacturation)

  if (loading) {
    return (
      <div>
        <h2> Cargando ...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <h2> Error!</h2>
      </div>
    )
  }

  const defaultSchema = {
    properties: {
      orgid: {
        title: 'Organizacion',
        width: 300,
      },
      rfc: {
        title: 'RFC',
        minWidth: 350,
      },
      email: {
        title: 'Email',
        minWidth: 100,
      },
      usoCFDI: {
        title: 'Uso de CFDI',
        minWidth: 100,
      },
    },
  }

  const options = [
    { value: 'adquisicion', label: 'Adquisicion de mercacia' },
    { value: 'gastos', label: 'Gastos en general' },
    { value: 'donativos', label: 'Donativos' },
  ]

  return (
    <Layout>
      <PageBlock
        title="Privarsa"
        subtitle="Que el cliente no pare."
        variation="full"
      >
        <Table
          items={data?.getFacturation}
          schema={defaultSchema}
          toolbar={{
            newLine: {
              label: 'Nueva factura',
              handleCallback: () => setOpen(true),
            },
          }}
          highlightOnHover
        />
      </PageBlock>

      <ModalDialog
        centered
        confirmation={{
          onClick: () => {

            mutateFunction({
              variables: {
                orgid: organizacion,
                rfc: rfc,
                email: email,
                usoCFDI: usoCFDISel
              }
            });

            setOpen(false);
          },
          label: 'Send',
        }}
        cancelation={{
          onClick: () => {
            setOpen(false)
          },
          label: 'Cancel',
        }}
        isOpen={isOpen}
        onClose={() => setOpen(!isOpen)}
      >
        <div className="flex flex-column flex-row-ns">
          <div className="w-100 w-50-ns">
            <p className="f3 f1-ns fw3 gray">
              Da de alta aqui una bonita factura.
            </p>
          </div>
          <div className="w-100 w-50-ns mv4 pv6-ns pl6-ns">
            <div className="w-100 mv6">
              <Input placeholder="Normbre organizacion" size="large" onChange={(e:any) => {
                setOrg(e.target.value)
              }} />
            </div>
            <div className="w-100 mv6">
              <Input placeholder="RFC" size="large" onChange={(e:any) => {
                setRFC(e.target.value)
              }} />
            </div>
            <div className="w-100 mv6">
              <Input placeholder="Email" size="large" onChange={(e:any) => {
                setEmail(e.target.value)
              }} />
            </div>
            <div className="w-100 mv6">
              <Dropdown
                label="Uso CFDI"
                size="regular"
                options={options}
                value={usoCFDISel}
                onChange={(_e: any, v: string) => setUsoCFDI(v)}
              />
            </div>
          </div>
        </div>
      </ModalDialog>
    </Layout>
  )
}

export default AdminExample
