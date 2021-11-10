import { LookerEmbedSDK } from '@looker/embed-sdk'
import React, { useEffect, useState} from 'react'



import {
    Button,
    Layout,
    Page,
    Section,
    Space,
    Box,
    ComponentsProvider
  } from '@looker/components'


export const DashboardEmbed = () => {
    const [dashboard, setDashboard] = useState()

    const setupDashboard = (dashboard) => {
        setDashboard(dashboard)
      }

    const runDashboard = () => {
        if (dashboard) {
          dashboard.run()
        }
      }

      const embedCtrRef = useEffect(
        (el) => {
                //el.innerHTML = ""
                LookerEmbedSDK.init('dev.looker.loppdev.com', "/auth")
                const embed = LookerEmbedSDK.createDashboardWithId(1)
                  .appendTo(el)
                embed
                  .build()
                  .connect()
                  .then(setupDashboard)
              
        },
        []
      )

    return (
        <ComponentsProvider>
          <Layout hasAside height="100%">
            <Section height="100%" px="small">
              <>
                <Box py="5px">
                  
                    <Button
                      onClick={runDashboard}
                    >
                      Run Dashboard
                    </Button>
                </Box>
                <div width="100%" ref={embedCtrRef} />
              </>
            </Section>
          </Layout>
        </ComponentsProvider>
      )
}