import { test, expect } from '../../fixtures'
import { DashboardPage } from '../../pages/DashboardPage'
import { ModalComponent } from '../../components/ModalComponent'
import { ToastComponent } from '../../components/ToastComponent'

test.describe('Delete Item @regression', () => {
  let dashboard: DashboardPage
  let modal: ModalComponent
  let toast: ToastComponent

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboard = new DashboardPage(authenticatedPage)
    modal = new ModalComponent(authenticatedPage)
    toast = new ToastComponent(authenticatedPage)
    await dashboard.navigate()
    await dashboard.waitForTableLoad()
  })

  test('shows confirmation modal before delete', async () => {
    await dashboard.clickDelete('itm_09')

    await modal.waitForModal()
    await modal.expectTitle('Delete Item')
    await modal.expectMessage('Are you sure')
  })

  test('cancel closes modal without deleting', async () => {
    const initialCount = await dashboard.getRowCount()

    await dashboard.clickDelete('itm_09')
    await modal.waitForModal()
    await modal.cancel()
    await modal.expectClosed()

    const afterCount = await dashboard.getRowCount()
    expect(afterCount).toBe(initialCount)
  })

  test('confirm deletes the item', async () => {
    const initialCount = await dashboard.getRowCount()

    await dashboard.clickDelete('itm_09')
    await modal.waitForModal()
    await modal.confirm()

    await toast.waitForToast()
    await toast.expectMessage('Item deleted successfully')

    const afterCount = await dashboard.getRowCount()
    expect(afterCount).toBe(initialCount - 1)
  })

  test('clicking backdrop closes modal', async () => {
    await dashboard.clickDelete('itm_10')
    await modal.waitForModal()
    await modal.clickBackdrop()
    await modal.expectClosed()
  })
})
