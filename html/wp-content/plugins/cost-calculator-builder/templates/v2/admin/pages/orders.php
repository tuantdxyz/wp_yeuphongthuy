<div class="ccb-settings-wrapper calculator-orders">
	<div class="ccb-main-container">
		<?php require_once CALC_PATH . '/templates/v2/admin/components/header.php'; ?>
		<div class="ccb-tab-content">
			<div class="ccb-tab-sections">
				<div class="ccb-table-body" v-if="preloader">
					<loader></loader>
				</div>
				<div class="ccb-table-body ccb-orders-page" v-else>
					<orders-empty v-if="noOrders && 'list' === step" label="<?php esc_attr_e( 'No Orders yet', 'cost-calculator-builder' ); ?>" description="<?php esc_attr_e( 'Your order list seems to be empty.', 'cost-calculator-builder' ); ?>"></orders-empty>
					<div class="ccb-table-body--card" v-else>
						<div class="table-display">
							<div class="table-display--left">
								<div class="ccb-bulk-actions">
									<div class="ccb-select-wrapper">
										<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
										<select v-model="bulkAction" class="ccb-select">
											<option value="none"><?php esc_html_e( 'Bulk actions', 'cost-calculator-builder' ); ?></option>
											<option value="complete" class="hide-if-no-js"><?php esc_html_e( 'Complete', 'cost-calculator-builder' ); ?></option>
											<option value="pending" class="hide-if-no-js"><?php esc_html_e( 'Pending', 'cost-calculator-builder' ); ?></option>
											<option value="delete"><?php esc_html_e( 'Delete', 'cost-calculator-builder' ); ?></option>
										</select>
									</div>
									<button class="ccb-button default" @click="updateMany"><?php esc_html_e( 'Apply', 'cost-calculator-builder' ); ?></button>
								</div>
							</div>
							<div class="table-display--right" style="align-items: center">
								<div class="ccb-bulk-actions">
									<a class="ccb-link" href="<?php echo esc_url( get_admin_url() . 'edit.php?post_type=shop_order' ); ?>" target="_blank">
										<i></i>
										<?php esc_html_e( 'WooCommerce Orders', 'cost-calculator-builder' ); ?>
									</a>
									<div class="ccb-select-wrapper">
										<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
										<select v-model="sort.payment" class="ccb-select" @change="resetPage">
											<option value="all"><?php esc_html_e( 'All payments', 'cost-calculator-builder' ); ?></option>
											<option value="no_payments" class="hide-if-no-js"><?php esc_html_e( 'No payments', 'cost-calculator-builder' ); ?></option>
											<option value="stripe" class="hide-if-no-js"><?php esc_html_e( 'Stripe', 'cost-calculator-builder' ); ?></option>
											<option value="paypal"><?php esc_html_e( 'Paypal', 'cost-calculator-builder' ); ?></option>
										</select>
									</div>
									<div class="ccb-select-wrapper">
										<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
										<select v-model="sort.status" class="ccb-select" @change="resetPage">
											<option value="all"><?php esc_html_e( 'Any status', 'cost-calculator-builder' ); ?></option>
											<option value="pending" class="hide-if-no-js"><?php esc_html_e( 'Pending', 'cost-calculator-builder' ); ?></option>
											<option value="complete" class="hide-if-no-js"><?php esc_html_e( 'Complete', 'cost-calculator-builder' ); ?></option>
										</select>
									</div>
									<div class="ccb-select-wrapper">
										<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
										<select v-model="sort.calc_id" class="ccb-select" @change="resetPage">
											<option value="all"><?php esc_html_e( 'All Calculators', 'cost-calculator-builder' ); ?></option>
											<option :value="calc.calc_id" class="hide-if-no-js" v-for="calc in this.calculatorList">
												{{ calc.calc_title }}
											</option>
										</select>
									</div>
								</div>
							</div>
						</div>
						<div class="table-concept ccb-custom-scrollbar" :class="{'ccb-no-content': 'list' !== step}">
							<div class="list-item orders-header">
								<div class="list-title check">
									<input type="checkbox" v-model="selectAll" @change="checkAll">
								</div>
								<div class="list-title sortable id" :class="isActiveSort('id')" @click="setSort('id')">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'ID', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title email" >
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Email', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title title">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Calculator Name', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title payment">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Payment method', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title sortable total" :class="isActiveSort('total')" @click="setSort('total')">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Total', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title sortable status" :class="isActiveSort('status')" @click="setSort('status')">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Status', 'cost-calculator-builder' ); ?></span>
								</div>
								<div class="list-title actions">
									<span class="ccb-default-title ccb-light"><?php esc_html_e( 'Actions', 'cost-calculator-builder' ); ?></span>
								</div>
							</div>
							<template v-if="step === 'list'">
								<orders-item
										v-for="order in getOrders"
										:key="order.id"
										:order="order"
										:detail="order.id === isOrderSelected?.id"
										:selected="order.selected"
										@set-details="setOrderDetails"
										@order-selected="onSelected"
										@fetch-data="fetchData"
								></orders-item>
							</template>
							<template v-else>
								<orders-empty label="<?php esc_attr_e( 'No results found', 'cost-calculator-builder' ); ?>" description="<?php esc_attr_e( 'Change search criteria', 'cost-calculator-builder' ); ?>"></orders-empty>
							</template>
						</div>
						<div class="ccb-pagination" v-if="step === 'list'">
							<div class="ccb-pages">
								<span class="ccb-page-item" @click="prevPage" v-if="sort.page != 1">
									<i class="ccb-icon-Path-3481 prev"></i>
								</span>
								<span class="ccb-page-item" v-for="n in totalPages" :key="n" :class="{active: n === sort.page}" @click="getPage(n)" :disabled="n == sort.page">{{ n }}</span>
								<span class="ccb-page-item" @click="nextPage" v-if="sort.page != totalPages">
									<i class="ccb-icon-Path-3481"></i>
								</span>
							</div>
							<div class="ccb-bulk-actions">
								<div class="ccb-select-wrapper ccb-select-orders">
									<i class="ccb-icon-Path-3485 ccb-select-arrow"></i>
									<select v-model="sort.limit" @change="resetPage" class="ccb-select">
										<option value="5"><?php esc_html_e( '5 orders per page', 'cost-calculator-builder' ); ?></option>
										<option value="10" class="hide-if-no-js"><?php esc_html_e( '10 orders per page', 'cost-calculator-builder' ); ?></option>
										<option value="15" class="hide-if-no-js"><?php esc_html_e( '15 orders per page', 'cost-calculator-builder' ); ?></option>
										<option value="20"><?php esc_html_e( '20 orders per page', 'cost-calculator-builder' ); ?></option>
									</select>
								</div>
							</div>
						</div>
					</div>
					<order-detail
						:selected="isOrderSelected"
						@clear-details="setOrderDetails"
					>
					</order-detail>
				</div>
			</div>
		</div>
	</div>
</div>
