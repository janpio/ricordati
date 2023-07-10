import Head from 'next/head'
import { Layout, Tabs } from '@/components/index'
import { GetStaticProps } from 'next'
import { getItems } from '../lib/prisma'

type Item = {
  id?: string
  name: string
  person: string
  ownedByMe: boolean
  createdAt: Date | string
  updatedAt?: Date | string
}

type TabItems = {
  lent: Item[]
  borrowed: Item[]
}

export default function Home({ lent, borrowed }: TabItems) {
  return (
    <>
      <Head>
        <title>Ricordati - an app to track lended and borrowed items</title>
        <meta
          name="description"
          content="Ricordati - an app to track lended and borrowed items"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Layout>
        <Tabs tabs={{ lent, borrowed }} />
      </Layout>
    </>
  )
}

const formattedItem = (item: Item) => ({
  id: item.id,
  name: item.name,
  createdAt: item.createdAt.toString(),
  person: item.person,
  ownedByMe: item.ownedByMe,
  updatedAt: item.updatedAt ? item.updatedAt.toString() : undefined,
})

// const findItems = async (ownedByMe: boolean): Promise<Item[]> => {
  // try {
  //   const items: Item[] = await prisma.item.findMany({
  //     where: { ownedByMe },
  //     orderBy: { createdAt: 'desc' },
  //   })
  //   console.log('Returned items from Prisma:', items)
  //   return items
  // } catch (error) {
  //   console.error('Error retrieving items from Prisma:', error)
  //   return []
  // }
// }

export const getStaticProps: GetStaticProps<TabItems> = async () => {
  const lent: Item[] = await getItems(true)
  const borrowed: Item[] = await getItems(false)

  const formattedLentItems: Item[] = lent.map((item: Item) =>
    formattedItem(item)
  )
  const formattedBorrowedItems: Item[] = borrowed.map((item: Item) =>
    formattedItem(item)
  )

  return {
    props: {
      lent: formattedLentItems,
      borrowed: formattedBorrowedItems,
    },
    revalidate: 10,
  }
}